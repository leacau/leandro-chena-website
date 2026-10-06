'use client';

import { useEffect, useState } from 'react';
import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
	Loader2,
	RefreshCw,
	UserCheck,
	Download,
	Mail,
	Phone,
	Building2,
	ExternalLink,
	Target,
} from 'lucide-react';
import { trackEvent } from '@/lib/tracking';

const STAGES = [
	{ id: 'nuevo', label: 'Nuevo Lead', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
	{ id: 'meeting_booked', label: 'Reunión Agendada', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
	{ id: 'qualified_lead', label: 'Lead Calificado', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
	{ id: 'proposal_sent', label: 'Propuesta Enviada', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
	{ id: 'client_won', label: 'Cliente Ganado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
	{ id: 'lost', label: 'No Calificado / Perdido', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
];

export default function LeadsManager() {
	const [leads, setLeads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);
	const { toast } = useToast();

	const loadLeads = async () => {
		try {
			setLoading(true);
			const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
			const snapshot = await getDocs(q);
			const loaded = snapshot.docs.map((docSnap) => ({
				id: docSnap.id,
				...docSnap.data(),
			}));
			setLeads(loaded);
		} catch (error) {
			console.error('Error al cargar leads:', error);
			toast({
				title: 'Error',
				description: 'No se pudieron cargar los leads de Firestore.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadLeads();
	}, []);

	const handleStageChange = async (lead, newStage) => {
		try {
			setUpdatingId(lead.id);
			const leadRef = doc(db, 'leads', lead.id);
			await updateDoc(leadRef, {
				lead_stage: newStage,
				updatedAt: new Date(),
			});

			// Actualizar en memoria
			setLeads((prev) =>
				prev.map((l) => (l.id === lead.id ? { ...l, lead_stage: newStage } : l))
			);

			// Notificar evento para dataLayer / offline tracking
			trackEvent(newStage, {
				lead_id: lead.id,
				email_hash: lead.hashed_data?.em || '',
				phone_hash: lead.hashed_data?.ph || '',
				gclid: lead.attribution?.gclid || '',
				fbc: lead.attribution?.fbc || '',
				utm_source: lead.attribution?.utm_source || '',
			});

			toast({
				title: 'Estado actualizado',
				description: `Lead cambiado a "${STAGES.find((s) => s.id === newStage)?.label}".`,
			});
		} catch (error) {
			console.error('Error al actualizar estado del lead:', error);
			toast({
				title: 'Error',
				description: 'No se pudo actualizar el estado.',
				variant: 'destructive',
			});
		} finally {
			setUpdatingId(null);
		}
	};

	// Exportar a CSV compatible con Google Ads Data Manager (Enhanced Conversions for Leads)
	const exportToGoogleAdsCSV = () => {
		if (leads.length === 0) return;

		const headers = [
			'Email (Hash SHA256)',
			'Phone (Hash SHA256)',
			'Conversion Name',
			'Conversion Time',
			'GCLID',
			'Order ID / Lead ID',
		];

		const rows = leads
			.filter((l) => l.lead_stage && l.lead_stage !== 'nuevo' && l.lead_stage !== 'lost')
			.map((l) => [
				l.hashed_data?.em || '',
				l.hashed_data?.ph || '',
				l.lead_stage, // qualified_lead, proposal_sent, client_won
				l.createdAt?.toDate ? l.createdAt.toDate().toISOString() : new Date().toISOString(),
				l.attribution?.gclid || '',
				l.id,
			]);

		const csvContent =
			'data:text/csv;charset=utf-8,' +
			[headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `google_ads_leads_conversions_${new Date().toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast({
			title: 'CSV Exportado',
			description: 'Archivo listo para subir a Google Ads Data Manager.',
		});
	};

	const formatDate = (dateField) => {
		if (!dateField) return '-';
		try {
			if (dateField.toDate) return dateField.toDate().toLocaleDateString('es-AR');
			return new Date(dateField).toLocaleDateString('es-AR');
		} catch {
			return '-';
		}
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<CardTitle className='text-2xl flex items-center gap-2'>
						<Target className='h-6 w-6 text-primary' />
						Pipeline de Leads y Conversiones Offline
					</CardTitle>
					<CardDescription>
						Gestioná la maduración de tus prospectos para retroalimentar Google Ads y Meta.
					</CardDescription>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={exportToGoogleAdsCSV}
						className='gap-2'
						disabled={loading || leads.length === 0}
					>
						<Download className='h-4 w-4' />
						Exportar Google Ads CSV
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={loadLeads}
						disabled={loading}
						className='gap-2'
					>
						<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
						Refrescar
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className='flex items-center justify-center py-12'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<span className='ml-2 text-muted-foreground'>Cargando leads...</span>
					</div>
				) : leads.length === 0 ? (
					<div className='text-center py-12 text-muted-foreground'>
						Aún no hay leads registrados en Firestore.
					</div>
				) : (
					<div className='overflow-x-auto rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Fecha</TableHead>
									<TableHead>Contacto</TableHead>
									<TableHead>Origen / Servicio</TableHead>
									<TableHead>Campaña / Click ID</TableHead>
									<TableHead>Estado del Lead</TableHead>
									<TableHead className='text-right'>Acción</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leads.map((lead) => {
									const currentStage = lead.lead_stage || 'nuevo';
									const stageInfo = STAGES.find((s) => s.id === currentStage);

									return (
										<TableRow key={lead.id}>
											<TableCell className='text-xs whitespace-nowrap text-muted-foreground'>
												{formatDate(lead.createdAt)}
											</TableCell>
											<TableCell>
												<div className='font-medium'>{lead.name || 'Sin nombre'}</div>
												<div className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
													<Mail className='h-3 w-3' />
													<a href={`mailto:${lead.email}`} className='hover:underline'>
														{lead.email}
													</a>
												</div>
												{lead.phone && (
													<div className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
														<Phone className='h-3 w-3' />
														<a
															href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
															target='_blank'
															rel='noopener noreferrer'
															className='text-green-600 hover:underline flex items-center gap-0.5'
														>
															{lead.phone}
															<ExternalLink className='h-2.5 w-2.5' />
														</a>
													</div>
												)}
												{lead.company && (
													<div className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
														<Building2 className='h-3 w-3' />
														{lead.company}
													</div>
												)}
											</TableCell>
											<TableCell>
												<div className='text-xs font-semibold capitalize'>
													{lead.service || lead.source || 'General'}
												</div>
												<div className='text-xs text-muted-foreground line-clamp-1'>
													{lead.source}
												</div>
											</TableCell>
											<TableCell>
												{lead.attribution?.utm_source ? (
													<Badge variant='outline' className='text-xs'>
														{lead.attribution.utm_source}
														{lead.attribution.utm_campaign ? ` / ${lead.attribution.utm_campaign}` : ''}
													</Badge>
												) : (
													<span className='text-xs text-muted-foreground'>Orgánico / Directo</span>
												)}
												{lead.attribution?.gclid && (
													<div className='text-[10px] text-green-700 font-mono mt-0.5'>
														GCLID detectado
													</div>
												)}
												{lead.attribution?.fbclid && (
													<div className='text-[10px] text-blue-700 font-mono mt-0.5'>
														FBCLID detectado
													</div>
												)}
											</TableCell>
											<TableCell>
												<span
													className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${stageInfo?.color}`}
												>
													{stageInfo?.label || currentStage}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex items-center justify-end gap-2'>
													<Select
														value={currentStage}
														onValueChange={(val) => handleStageChange(lead, val)}
														disabled={updatingId === lead.id}
													>
														<SelectTrigger className='w-[160px] h-8 text-xs'>
															<SelectValue placeholder='Cambiar estado' />
														</SelectTrigger>
														<SelectContent>
															{STAGES.map((s) => (
																<SelectItem key={s.id} value={s.id} className='text-xs'>
																	{s.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

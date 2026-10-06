'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
	Briefcase,
	Users,
	TrendingUp,
	CheckCircle2,
	ArrowRight,
	ArrowLeft,
	Sparkles,
	Building,
	UserCheck,
	Flame,
	ShieldCheck,
	Compass,
	Target,
	DollarSign,
	Loader2,
} from 'lucide-react';
import BookMeetingDialog from '@/components/book-meeting-dialog';
import { toast } from '@/hooks/use-toast';
import {
	captureUrlParams,
	getMetaCookies,
	getStoredAttribution,
	normalizePhone,
	sha256,
	trackEvent,
} from '@/lib/tracking';

const ROLES = [
	{
		id: 'dueno',
		label: 'Dueño de Empresa / Director General',
		subtitle: 'Busco rentabilidad, orden comercial y líderes autónomos.',
		icon: Building,
	},
	{
		id: 'gerente',
		label: 'Gerente / Jefe de Ventas o Comercial',
		subtitle: 'Lidero un equipo y necesito alcanzar o superar los objetivos.',
		icon: Briefcase,
	},
	{
		id: 'profesional',
		label: 'Vendedor / Profesional Independiente',
		subtitle: 'Gestiono mis propias ventas y quiero potenciar mi efectividad y cierres.',
		icon: UserCheck,
	},
];

// Desafíos contextuales y dolores específicos para cada rol
const ROLE_CHALLENGES = {
	dueno: [
		{
			id: 'consultoria',
			label: 'Siento que el área comercial depende demasiado de mí y faltan procesos claros',
			description: 'Falta un sistema predecible, métricas confiables y orden en el embudo comercial.',
			recommendedService: 'Consultoría Comercial para Empresas',
			icon: ShieldCheck,
		},
		{
			id: 'capacitaciones',
			label: 'El equipo vende, pero no defiende el precio y cierra menos de lo esperado',
			description: 'Falta técnica de venta consultiva, manejo de objeciones y negociación de alto valor.',
			recommendedService: 'Capacitaciones para Equipos Comerciales',
			icon: TrendingUp,
		},
		{
			id: 'charlas',
			label: 'Noto estancamiento, desalineación cultural o falta de compromiso general',
			description: 'Necesitamos renovar la mentalidad, el liderazgo y el sentido de propósito en la empresa.',
			recommendedService: 'Charlas Motivacionales y Conferencias',
			icon: Flame,
		},
	],
	gerente: [
		{
			id: 'capacitaciones',
			label: 'A los vendedores les cuesta cerrar acuerdos y ceden rápido ante el precio',
			description: 'Necesito que incorporen herramientas prácticas para superar objeciones y elevar el ticket promedio.',
			recommendedService: 'Capacitaciones para Equipos Comerciales',
			icon: TrendingUp,
		},
		{
			id: 'consultoria',
			label: 'Tenemos fugas en el embudo de ventas y nos cuesta medir la productividad',
			description: 'Optimización de las etapas comerciales, seguimiento de prospectos y métricas de rendimiento.',
			recommendedService: 'Consultoría Comercial para Empresas',
			icon: Target,
		},
		{
			id: 'mentorias',
			label: 'Quiero fortalecer mi propio liderazgo para gestionar y motivar mejor a mi fuerza de ventas',
			description: 'Mentoría ejecutiva 1 a 1 para resolver casos reales, liderar con empatía y tomar decisiones firmes.',
			recommendedService: 'Mentorías 1:1 para Líderes Comerciales',
			icon: Compass,
		},
	],
	profesional: [
		{
			id: 'mentorias',
			label: 'Quiero dominar el proceso de ventas consultivas y cerrar acuerdos más grandes',
			description: 'Acompañamiento personalizado 1 a 1 para pulir tu discurso, tu propuesta y tu seguridad comercial.',
			recommendedService: 'Mentorías 1:1 Personalizadas',
			icon: Sparkles,
		},
		{
			id: 'mentorias_objeciones',
			label: 'Me trabo en el momento de hablar de dinero o rebatir objeciones de clientes',
			description: 'Técnicas probadas de persuasión ética y negociación para defender el valor de tu trabajo.',
			recommendedService: 'Mentorías 1:1 en Negociación y Cierre',
			icon: DollarSign,
		},
		{
			id: 'capacitaciones_abiertas',
			label: 'Busco formación práctica y actualizada para actualizar mis habilidades comerciales',
			description: 'Programas y talleres prácticos orientados a vendedores y consultores profesionales.',
			recommendedService: 'Programas de Capacitación Comercial',
			icon: TrendingUp,
		},
	],
};

const TEAM_SIZES = {
	dueno: [
		{ id: '1-3', label: '1 a 3 personas en ventas' },
		{ id: '4-10', label: '4 a 10 personas en ventas' },
		{ id: 'mas-10', label: 'Más de 10 personas en ventas' },
		{ id: 'creacion', label: 'Estamos armando el equipo recién' },
	],
	gerente: [
		{ id: '1-3', label: 'Equipo chico (1 a 3 vendedores)' },
		{ id: '4-10', label: 'Equipo mediano (4 a 10 vendedores)' },
		{ id: 'mas-10', label: 'Equipo grande (más de 10 vendedores)' },
	],
	profesional: [
		{ id: 'solo', label: 'Trabajo por mi cuenta (100% individual)' },
		{ id: 'socio', label: 'Tengo 1 socio o colega' },
		{ id: 'vendedor_empresa', label: 'Soy vendedor dentro de una empresa' },
	],
};

export default function CommercialDiagnosticQuiz() {
	const [step, setStep] = useState(1);
	const [role, setRole] = useState('');
	const [challenge, setChallenge] = useState('');
	const [teamSize, setTeamSize] = useState('');

	// Datos de contacto
	const [contactData, setContactData] = useState({
		name: '',
		email: '',
		phone: '',
		company: '',
		website: '', // honeypot
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Desafíos según el rol seleccionado
	const currentChallenges = role ? ROLE_CHALLENGES[role] || [] : [];
	const currentTeamSizes = role ? TEAM_SIZES[role] || [] : [];

	// Desafío y servicio seleccionado
	const selectedChallengeObj = currentChallenges.find((c) => c.id === challenge);
	const recommendedService =
		selectedChallengeObj?.recommendedService || 'Consultoría y Capacitación Comercial';

	const handleRoleSelect = (selectedRole) => {
		setRole(selectedRole);
		setChallenge('');
		setTeamSize('');
		trackEvent('diagnostic_start', {
			step: 1,
			role: selectedRole,
		});
		setStep(2);
	};

	const handleChallengeSelect = (selectedChallenge) => {
		setChallenge(selectedChallenge);
		trackEvent('diagnostic_progress', {
			step: 2,
			role,
			challenge: selectedChallenge,
		});
		setStep(3);
	};

	const handleTeamSizeSelect = (size) => {
		setTeamSize(size);
		trackEvent('diagnostic_progress', {
			step: 3,
			role,
			team_size: size,
		});
		setStep(4);
	};

	const handleSubmitLead = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (contactData.website) {
				setIsSubmitting(false);
				return;
			}

			captureUrlParams();
			const attribution = getStoredAttribution();
			const metaCookies = getMetaCookies();
			const normalizedPhone = normalizePhone(contactData.phone);

			const [emailHash, phoneHash] = await Promise.all([
				sha256(contactData.email),
				sha256(normalizedPhone),
			]);

			const roleLabel = ROLES.find((r) => r.id === role)?.label || role;

			const [{ db }, { collection, addDoc, serverTimestamp }] = await Promise.all([
				import('@/lib/firebase'),
				import('firebase/firestore'),
			]);

			await addDoc(collection(db, 'leads'), {
				name: contactData.name.trim(),
				email: contactData.email.trim().toLowerCase(),
				phone: normalizedPhone,
				company: contactData.company.trim(),
				source: 'Diagnosticador Comercial Interactivo',
				service: selectedChallengeObj?.recommendedService || 'diagnostico_personalizado',
				lead_stage: 'qualified_lead',
				message: `Rol: ${roleLabel} | Desafío: ${selectedChallengeObj?.label} | Estructura: ${teamSize}`,
				attribution: {
					...attribution,
					fbp: metaCookies.fbp || '',
					fbc: metaCookies.fbc || '',
				},
				hashed_data: {
					em: emailHash,
					ph: phoneHash,
				},
				createdAt: serverTimestamp(),
			});

			// Enviar notificación a Formspree
			try {
				await fetch('https://formspree.io/f/xpwplepb', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: contactData.name,
						email: contactData.email,
						phone: contactData.phone,
						company: contactData.company,
						servicioRecomendado: recommendedService,
						rol: roleLabel,
						estructura: teamSize,
						desafioPrincipal: selectedChallengeObj?.label,
						_subject: `Nuevo Diagnóstico Calificado: ${contactData.name} [${roleLabel}]`,
					}),
				});
			} catch (formspreeErr) {
				console.warn('Error enviando Formspree:', formspreeErr);
			}

			trackEvent('diagnostic_submit', {
				form_name: 'commercial_diagnostic_quiz',
				recommended_service: recommendedService,
				role: role,
				team_size: teamSize,
			});

			setIsSubmitted(true);
			toast({
				title: '¡Diagnóstico enviado con éxito!',
				description: 'Te responderemos a la brevedad con la recomendación para tu caso.',
			});
		} catch (error) {
			console.error('Error enviando diagnóstico:', error);
			toast({
				title: 'Error',
				description: 'Hubo un inconveniente al procesar los datos. Podés agendar directo abajo.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const progressValue = (step / 4) * 100;

	return (
		<div className='w-full max-w-3xl mx-auto'>
			<Card className='border border-border shadow-xl overflow-hidden bg-card rounded-2xl'>
				{/* Barra de progreso */}
				<div className='p-6 pb-3 border-b bg-muted/20'>
					<div className='flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2'>
						<span>Diagnóstico de Situación Comercial</span>
						<span>Paso {step} de 4</span>
					</div>
					<Progress value={progressValue} className='h-2' />
				</div>

				<CardContent className='p-6 sm:p-8'>
					{/* PASO 1: ROL */}
					{step === 1 && (
						<div className='space-y-6'>
							<div className='text-center sm:text-left'>
								<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3'>
									<Sparkles className='h-3.5 w-3.5' /> Evaluación en 1 minuto
								</span>
								<h3 className='text-2xl font-bold tracking-tight text-foreground'>
									¿Desde qué rol querés potenciar tus ventas?
								</h3>
								<p className='text-sm text-muted-foreground mt-1'>
									Seleccioná tu posición para personalizar las preguntas a tus verdaderas preocupaciones:
								</p>
							</div>

							<div className='grid gap-4 sm:grid-cols-1'>
								{ROLES.map((r) => {
									const Icon = r.icon;
									return (
										<button
											key={r.id}
											type='button'
											onClick={() => handleRoleSelect(r.id)}
											className='flex items-center justify-between p-5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group'
										>
											<div className='flex items-start sm:items-center gap-4'>
												<div className='p-3 rounded-lg bg-primary/10 group-hover:bg-[#00905E] group-hover:text-white transition-colors shrink-0'>
													<Icon className='h-6 w-6 text-primary group-hover:text-white' />
												</div>
												<div>
													<span className='font-bold text-base sm:text-lg block text-foreground group-hover:text-primary transition-colors'>
														{r.label}
													</span>
													<span className='text-xs sm:text-sm text-muted-foreground mt-0.5 block'>
														{r.subtitle}
													</span>
												</div>
											</div>
											<ArrowRight className='h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform shrink-0 ml-2' />
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* PASO 2: DESAFÍO ESPECÍFICO SEGÚN ROL */}
					{step === 2 && (
						<div className='space-y-6'>
							<div className='flex items-center justify-between'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setStep(1)}
									className='gap-1 text-xs text-muted-foreground'
								>
									<ArrowLeft className='h-4 w-4' /> Cambiar rol
								</Button>
								<span className='text-xs text-muted-foreground font-medium'>
									Paso 2 de 4
								</span>
							</div>

							<div>
								<h3 className='text-2xl font-bold tracking-tight text-foreground'>
									{role === 'profesional'
										? '¿Cuál es hoy tu mayor dificultad al momento de vender?'
										: role === 'dueno'
										? '¿Cuál es la principal preocupación en tu negocio hoy?'
										: '¿Cuál es el mayor desafío con tu equipo comercial?'}
								</h3>
								<p className='text-sm text-muted-foreground mt-1'>
									Elegí la situación que mejor describe tu situación actual:
								</p>
							</div>

							<div className='space-y-3'>
								{currentChallenges.map((c) => {
									const Icon = c.icon;
									return (
										<button
											key={c.id}
											type='button'
											onClick={() => handleChallengeSelect(c.id)}
											className='w-full flex items-start gap-4 p-5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group'
										>
											<div className='p-2.5 rounded-lg bg-primary/10 mt-0.5 group-hover:bg-[#00905E] group-hover:text-white transition-colors shrink-0'>
												<Icon className='h-5 w-5 text-primary group-hover:text-white' />
											</div>
											<div className='flex-1'>
												<h4 className='font-bold text-base text-foreground group-hover:text-primary transition-colors'>
													{c.label}
												</h4>
												<p className='text-xs sm:text-sm text-muted-foreground mt-1'>
													{c.description}
												</p>
											</div>
											<ArrowRight className='h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform shrink-0 mt-1' />
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* PASO 3: ESTRUCTURA / EQUIPO SEGÚN ROL */}
					{step === 3 && (
						<div className='space-y-6'>
							<div className='flex items-center justify-between'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setStep(2)}
									className='gap-1 text-xs text-muted-foreground'
								>
									<ArrowLeft className='h-4 w-4' /> Volver al desafío
								</Button>
								<span className='text-xs text-muted-foreground font-medium'>
									Paso 3 de 4
								</span>
							</div>

							<div>
								<h3 className='text-2xl font-bold tracking-tight text-foreground'>
									{role === 'profesional'
										? '¿Cómo está conformada tu actividad actualmente?'
										: '¿De qué dimensión es el equipo comercial a intervenir?'}
								</h3>
								<p className='text-sm text-muted-foreground mt-1'>
									Esto define si conviene un formato grupal, de consultoría integral o de mentoría 1 a 1:
								</p>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{currentTeamSizes.map((ts) => (
									<button
										key={ts.id}
										type='button'
										onClick={() => handleTeamSizeSelect(ts.label)}
										className='flex items-center justify-between p-5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all font-semibold text-base text-foreground group text-left'
									>
										<div className='flex items-center gap-3'>
											<Users className='h-5 w-5 text-primary shrink-0' />
											<span>{ts.label}</span>
										</div>
										<ArrowRight className='h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform shrink-0 ml-2' />
									</button>
								))}
							</div>
						</div>
					)}

					{/* PASO 4: RESULTADO PERSONALIZADO Y LLAMADA A LA ACCIÓN */}
					{step === 4 && (
						<div className='space-y-6'>
							{/* Encabezado del resultado */}
							<div className='p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center sm:text-left'>
								<span className='text-xs uppercase tracking-wider font-bold text-primary'>
									Recomendación estratégica para tu perfil
								</span>
								<h3 className='text-2xl sm:text-3xl font-extrabold text-foreground mt-1'>
									{recommendedService}
								</h3>
								<p className='text-sm text-muted-foreground mt-2'>
									{role === 'profesional'
										? 'Para tu perfil independiente, un trabajo personalizado de mentoría es el camino más directo para transformar tu efectividad y elevar tus honorarios sin perder meses en prueba y error.'
										: role === 'dueno'
										? 'Para la dirección de tu empresa, esta alternativa está enfocada en generar previsibilidad, autonomía y un impacto directo en el balance de resultados.'
										: 'Para la gestión de tu fuerza comercial, este programa provee metodología práctica, herramientas de cierre y seguimiento medible.'}
								</p>
							</div>

							{!isSubmitted ? (
								<form onSubmit={handleSubmitLead} className='space-y-4 pt-2'>
									<div className='hidden' aria-hidden='true'>
										<Input
											tabIndex={-1}
											autoComplete='off'
											value={contactData.website}
											onChange={(e) =>
												setContactData({ ...contactData, website: e.target.value })
											}
										/>
									</div>

									<p className='text-sm font-semibold text-foreground'>
										Dejanos tus datos de contacto para enviarte la propuesta y temario detallado:
									</p>

									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='diag-name'>Nombre y Apellido *</Label>
											<Input
												id='diag-name'
												required
												placeholder='Ej. María Fernández'
												value={contactData.name}
												onChange={(e) =>
													setContactData({ ...contactData, name: e.target.value })
												}
											/>
										</div>
										<div>
											<Label htmlFor='diag-email'>Email *</Label>
											<Input
												id='diag-email'
												type='email'
												required
												placeholder='maria@empresa.com'
												value={contactData.email}
												onChange={(e) =>
													setContactData({ ...contactData, email: e.target.value })
												}
											/>
										</div>
										<div>
											<Label htmlFor='diag-phone'>WhatsApp *</Label>
											<Input
												id='diag-phone'
												type='tel'
												required
												placeholder='+54 9 ...'
												value={contactData.phone}
												onChange={(e) =>
													setContactData({ ...contactData, phone: e.target.value })
												}
											/>
										</div>
										<div>
											<Label htmlFor='diag-company'>
												{role === 'profesional' ? 'Actividad / Rubro' : 'Empresa u Organización'}
											</Label>
											<Input
												id='diag-company'
												placeholder={
													role === 'profesional'
														? 'Tu especialidad o servicio'
														: 'Nombre de la empresa'
												}
												value={contactData.company}
												onChange={(e) =>
													setContactData({ ...contactData, company: e.target.value })
												}
											/>
										</div>
									</div>

									<Button
										type='submit'
										size='lg'
										className='w-full py-4 text-base font-semibold shadow-md'
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className='mr-2 h-5 w-5 animate-spin' />
												Enviando diagnóstico...
											</>
										) : (
											'Recibir Propuesta y Plan de Acción'
										)}
									</Button>
								</form>
							) : (
								<div className='p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-center space-y-3'>
									<CheckCircle2 className='h-10 w-10 text-green-600 mx-auto' />
									<h4 className='text-lg font-bold text-green-800 dark:text-green-300'>
										¡Diagnóstico recibido correctamente!
									</h4>
									<p className='text-sm text-green-700 dark:text-green-400 max-w-md mx-auto'>
										Revisaremos tus respuestas y te contactaremos para presentarte la solución sugerida.
									</p>
								</div>
							)}

							{/* Separador hacia agenda directa */}
							<div className='relative my-6'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-border' />
								</div>
								<div className='relative flex justify-center text-xs uppercase'>
									<span className='bg-card px-3 text-muted-foreground font-semibold'>
										O si querés avanzar directamente
									</span>
								</div>
							</div>

							<div className='p-6 rounded-xl border bg-muted/30 text-center space-y-4'>
								<div>
									<h4 className='font-bold text-base sm:text-lg text-foreground'>
										Coordiná una llamada de 30 minutos con Leandro
									</h4>
									<p className='text-xs sm:text-sm text-muted-foreground mt-1'>
										Elegí un día y horario en su Google Calendar para evaluar tu caso de forma personalizada.
									</p>
								</div>
								<div className='flex justify-center'>
									<BookMeetingDialog
										triggerText='Agendar llamada de diagnóstico'
										triggerSize='lg'
										source='diagnostic_quiz_result'
										className='w-full sm:w-auto shadow-md'
									/>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

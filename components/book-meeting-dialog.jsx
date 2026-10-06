'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Clock } from 'lucide-react';
import { GOOGLE_CALENDAR_URL } from '@/lib/tracking-constants';
import { trackEvent } from '@/lib/tracking';

export default function BookMeetingDialog({
	triggerText = 'Agendar llamada de diagnóstico',
	triggerVariant = 'default',
	triggerSize = 'lg',
	className = '',
	source = 'general',
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenChange = (open) => {
		setIsOpen(open);
		if (open) {
			trackEvent('calendar_click', {
				source,
				action: 'open_modal',
			});
		}
	};

	const handleExternalClick = () => {
		trackEvent('meeting_booked_click', {
			source,
			destination: 'google_calendar_direct',
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant={triggerVariant}
					size={triggerSize}
					className={`gap-2 ${className}`}
				>
					<Calendar className='h-4 w-4 shrink-0' />
					<span>{triggerText}</span>
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-4xl w-[95vw] h-[90vh] max-h-[850px] p-4 sm:p-6 flex flex-col bg-white dark:bg-gray-900 border shadow-2xl'>
				<DialogHeader className='pb-3 border-b'>
					<DialogTitle className='flex items-center gap-2 text-xl font-bold text-foreground'>
						<Clock className='h-5 w-5 text-primary' />
						Llamada de Diagnóstico Comercial (30 min)
					</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						Seleccioná el día y horario que mejor te quede para conversar durante 30 minutos directamente con Leandro.
					</DialogDescription>
				</DialogHeader>

				<div className='flex-1 w-full h-full min-h-[400px] relative rounded-xl overflow-hidden border my-3 bg-white'>
					<iframe
						src={GOOGLE_CALENDAR_URL}
						className='w-full h-full border-0 bg-white'
						title='Agendar Cita con Leandro Chena'
					/>
				</div>

				<div className='flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-muted-foreground'>
					<span>¿Tenés problemas visualizando el calendario integrado?</span>
					<a
						href={GOOGLE_CALENDAR_URL}
						target='_blank'
						rel='noopener noreferrer'
						onClick={handleExternalClick}
						className='inline-flex items-center gap-1.5 text-primary hover:underline font-semibold'
					>
						Abrir directamente en Google Calendar
						<ExternalLink className='h-3.5 w-3.5' />
					</a>
				</div>
			</DialogContent>
		</Dialog>
	);
}

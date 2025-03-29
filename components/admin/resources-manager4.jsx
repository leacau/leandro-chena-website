'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Eye,
	FileIcon,
	FileTextIcon,
	ImageIcon,
	Loader2,
	Pencil,
	Trash,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NextLink from 'next/link';
import Script from 'next/script';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ResourcesManager() {
	const [resources, setResources] = useState([]);
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [content, setContent] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const [fileUrl, setFileUrl] = useState('');
	const [editingResource, setEditingResource] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [editorLoaded, setEditorLoaded] = useState(false);
	const [activeTab, setActiveTab] = useState('list');
	const { toast } = useToast();
	const editorRef = useRef(null);
	const editorElementRef = useRef(null);

	// Cargar recursos al iniciar
	useEffect(() => {
		loadResources();
	}, []);

	// Inicializar el editor cuando el componente se monta y el script está cargado
	useEffect(() => {
		if (
			editorLoaded &&
			window.ClassicEditor &&
			editorElementRef.current &&
			activeTab === 'create' &&
			!editorRef.current
		) {
			initEditor();
		}
	}, [editorLoaded, activeTab]);

	// Inicializar el editor CKEditor
	const initEditor = async () => {
		try {
			if (editorRef.current || !editorElementRef.current) {
				return;
			}

			const editor = await window.ClassicEditor.create(
				editorElementRef.current,
				{
					toolbar: [
						'heading',
						'|',
						'bold',
						'italic',
						'underline',
						'link',
						'|',
						'bulletedList',
						'numberedList',
						'|',
						'outdent',
						'indent',
						'|',
						'blockQuote',
						'insertTable',
						'undo',
						'redo',
					],
					heading: {
						options: [
							{
								model: 'paragraph',
								title: 'Párrafo',
								class: 'ck-heading_paragraph',
							},
							{
								model: 'heading1',
								view: 'h1',
								title: 'Encabezado 1',
								class: 'ck-heading_heading1',
							},
							{
								model: 'heading2',
								view: 'h2',
								title: 'Encabezado 2',
								class: 'ck-heading_heading2',
							},
							{
								model: 'heading3',
								view: 'h3',
								title: 'Encabezado 3',
								class: 'ck-heading_heading3',
							},
						],
					},
					placeholder: 'Escribe el contenido del recurso aquí...',
					indentBlock: {
						offset: 1,
						unit: 'em',
					},
					list: {
						properties: {
							styles: true,
							startIndex: true,
							reversed: true,
						},
					},
					blockQuote: {
						toolbar: ['blockQuote'],
					},
				}
			);

			editor.setData(content);

			editor.model.document.on('change:data', () => {
				const newContent = editor.getData();
				setContent(newContent);
			});

			editorRef.current = editor;
		} catch (error) {
			console.error('Error al inicializar el editor:', error);
			toast({
				title: 'Error',
				description:
					'No se pudo inicializar el editor. Por favor, recarga la página.',
				variant: 'destructive',
			});
		}
	};

	// Limpiar el editor cuando el componente se desmonta
	useEffect(() => {
		return () => {
			if (editorRef.current) {
				editorRef.current
					.destroy()
					.catch((error) =>
						console.error('Error al destruir el editor:', error)
					);
				editorRef.current = null;
			}
		};
	}, []);

	// Actualizar el contenido del editor cuando se edita un recurso
	useEffect(() => {
		if (editorRef.current && editingResource) {
			editorRef.current.setData(content);
		}
	}, [editingResource, content]);

	const loadResources = async () => {
		console.log('Loading resources...');
		try {
			setLoading(true);
			const resourcesQuery = query(
				collection(db, 'resources'),
				orderBy('createdAt', 'desc')
			);
			const querySnapshot = await getDocs(resourcesQuery);
			const resourcesData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			console.log('Resources loaded:', resourcesData);
			setResources(resourcesData);
		} catch (error) {
			console.error('Error al cargar los recursos:', error);
			toast({
				title: 'Error',
				description: 'No se pudieron cargar los recursos.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setFileName(selectedFile.name);
		}
	};

	const generateSlug = (text) => {
		return text
			.toString()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-');
	};

	const handleTitleChange = (e) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		if (!editingResource || !editingResource.slug) {
			setSlug(generateSlug(newTitle));
		}
	};

	const resetForm = () => {
		setTitle('');
		setSlug('');
		setContent('');
		if (editorRef.current) {
			editorRef.current.setData('');
		}
		setDescription('');
		setCategory('');
		setImage(null);
		setImagePreview('');
		setImageUrl('');
		setFile(null);
		setFileName('');
		setFileUrl('');
		setEditingResource(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !slug) {
			toast({
				title: 'Campos requeridos',
				description: 'Por favor completa al menos título y slug.',
				variant: 'destructive',
			});
			return;
		}

		try {
			setSubmitting(true);
			let finalImageUrl = imageUrl;
			let finalFileUrl = fileUrl;

			// Si hay una nueva imagen, subirla a Storage
			if (image) {
				const storageRef = ref(
					storage,
					`resources/images/${slug}-${Date.now()}`
				);
				await uploadBytes(storageRef, image);
				finalImageUrl = await getDownloadURL(storageRef);
			}

			// Si hay un nuevo archivo, subirlo a Storage
			if (file) {
				const storageRef = ref(
					storage,
					`resources/files/${slug}-${Date.now()}-${fileName}`
				);
				await uploadBytes(storageRef, file);
				finalFileUrl = await getDownloadURL(storageRef);
			}

			const resourceData = {
				title,
				slug,
				content,
				description,
				category,
				updatedAt: serverTimestamp(),
			};

			if (finalImageUrl) {
				resourceData.image = finalImageUrl;
			}

			if (finalFileUrl) {
				resourceData.fileUrl = finalFileUrl;
				resourceData.fileName = fileName || 'Archivo adjunto';
			}

			if (editingResource) {
				// Actualizar recurso existente
				await updateDoc(doc(db, 'resources', editingResource.id), resourceData);
				toast({
					title: 'Recurso actualizado',
					description: 'El recurso ha sido actualizado correctamente.',
				});
			} else {
				// Crear nuevo recurso
				resourceData.createdAt = serverTimestamp();
				await addDoc(collection(db, 'resources'), resourceData);
				toast({
					title: 'Recurso creado',
					description: 'El recurso ha sido creado correctamente.',
				});
			}

			resetForm();
			loadResources();
			setActiveTab('list');
		} catch (error) {
			console.error('Error al guardar el recurso:', error);
			toast({
				title: 'Error',
				description: 'No se pudo guardar el recurso. Inténtalo de nuevo.',
				variant: 'destructive',
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (resource) => {
		setEditingResource(resource);
		setTitle(resource.title || '');
		setSlug(resource.slug || '');
		setContent(resource.content || '');
		setDescription(resource.description || '');
		setCategory(resource.category || '');
		setImageUrl(resource.image || '');
		setImagePreview(resource.image || '');
		setFileUrl(resource.fileUrl || '');
		setFileName(resource.fileName || '');
		setImage(null);
		setFile(null);

		// Cambiar a la pestaña de edición
		setActiveTab('create');

		// Asegurarse de que el editor esté inicializado y actualizar su contenido
		setTimeout(() => {
			if (editorRef.current) {
				editorRef.current.setData(resource.content || '');
			}
		}, 100);
	};

	const handleDelete = async (resource) => {
		if (
			!window.confirm(
				`¿Estás seguro de que quieres eliminar el recurso "${resource.title}"?`
			)
		) {
			return;
		}

		try {
			setLoading(true);

			// Eliminar la imagen de Storage si existe
			if (resource.image) {
				try {
					const imageUrl = new URL(resource.image);
					const pathMatch = imageUrl.pathname.match(/\/o\/(.+?)(?:\?|$)/);

					if (pathMatch && pathMatch[1]) {
						const imagePath = decodeURIComponent(pathMatch[1]);
						const imageRef = ref(storage, imagePath);
						await deleteObject(imageRef);
					}
				} catch (imageError) {
					console.error('Error al eliminar la imagen:', imageError);
				}
			}

			// Eliminar el archivo de Storage si existe
			if (resource.fileUrl) {
				try {
					const fileUrl = new URL(resource.fileUrl);
					const pathMatch = fileUrl.pathname.match(/\/o\/(.+?)(?:\?|$)/);

					if (pathMatch && pathMatch[1]) {
						const filePath = decodeURIComponent(pathMatch[1]);
						const fileRef = ref(storage, filePath);
						await deleteObject(fileRef);
					}
				} catch (fileError) {
					console.error('Error al eliminar el archivo:', fileError);
				}
			}

			// Eliminar el recurso de Firestore
			await deleteDoc(doc(db, 'resources', resource.id));

			toast({
				title: 'Recurso eliminado',
				description: 'El recurso ha sido eliminado correctamente.',
			});

			// Si estábamos editando este recurso, resetear el formulario
			if (editingResource && editingResource.id === resource.id) {
				resetForm();
			}

			// Recargar la lista de recursos
			loadResources();
		} catch (error) {
			console.error('Error al eliminar el recurso:', error);
			toast({
				title: 'Error',
				description: 'No se pudo eliminar el recurso. Inténtalo de nuevo.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (value) => {
		setActiveTab(value);

		// Si cambiamos a la pestaña de creación, inicializar el editor después de un breve retraso
		if (
			value === 'create' &&
			editorLoaded &&
			window.ClassicEditor &&
			!editorRef.current
		) {
			setTimeout(() => {
				if (editorElementRef.current && !editorRef.current) {
					initEditor();
				}
			}, 100);
		}
	};

	return (
		<>
			<Script
				src='https://cdn.ckeditor.com/ckeditor5/40.0.0/decoupled-document/ckeditor.js'
				onLoad={() => setEditorLoaded(true)}
				strategy='afterInteractive'
			/>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className='w-full'
			>
				<TabsList className='mb-4'>
					<TabsTrigger value='list'>Lista de Recursos</TabsTrigger>
					<TabsTrigger value='create'>Crear/Editar Recurso</TabsTrigger>
				</TabsList>

				<TabsContent value='list'>
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold'>Recursos Disponibles</h2>
							<Button onClick={loadResources} disabled={loading}>
								{loading ? (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								) : (
									'Actualizar'
								)}
							</Button>
						</div>

						{loading ? (
							<div className='flex justify-center p-8'>
								<Loader2 className='h-8 w-8 animate-spin' />
							</div>
						) : resources.length === 0 ? (
							<p className='text-center py-8 text-muted-foreground'>
								No hay recursos disponibles aún.
							</p>
						) : (
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{resources.map((resource) => (
									<Card key={resource.id} className='flex flex-col'>
										<CardHeader className='pb-2'>
											<CardTitle className='line-clamp-2'>
												{resource.title}
											</CardTitle>
											<CardDescription>
												{resource.category || 'Sin categoría'}
											</CardDescription>
										</CardHeader>
										<CardContent className='flex-grow'>
											{resource.image && (
												<div className='relative h-40 mb-4 rounded overflow-hidden'>
													<img
														src={resource.image || '/placeholder.svg'}
														alt={resource.title}
														className='object-cover w-full h-full'
														onError={(e) => {
															e.target.onerror = null;
															e.target.src =
																'/placeholder.svg?height=200&width=400';
														}}
													/>
												</div>
											)}
											<p className='line-clamp-3 text-sm text-muted-foreground mb-2'>
												{resource.description || 'Sin descripción'}
											</p>
											{resource.fileUrl && (
												<div className='flex items-center text-sm text-blue-600 mt-2'>
													<FileIcon className='h-4 w-4 mr-1' />
													<span className='truncate'>
														{resource.fileName || 'Archivo adjunto'}
													</span>
												</div>
											)}
										</CardContent>
										<CardFooter className='flex justify-between pt-2'>
											<div className='flex space-x-2'>
												<Button
													size='sm'
													variant='outline'
													onClick={() => handleEdit(resource)}
												>
													<Pencil className='h-4 w-4 mr-1' />
													Editar
												</Button>
												<Button
													size='sm'
													variant='destructive'
													onClick={() => handleDelete(resource)}
												>
													<Trash className='h-4 w-4 mr-1' />
													Eliminar
												</Button>
											</div>
											<Button size='sm' variant='ghost' asChild>
												<NextLink
													href={`/recursos/${resource.slug}`}
													target='_blank'
												>
													<Eye className='h-4 w-4 mr-1' />
													Ver
												</NextLink>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value='create'>
					<Card>
						<CardHeader>
							<CardTitle>
								{editingResource ? 'Editar Recurso' : 'Crear Nuevo Recurso'}
							</CardTitle>
							<CardDescription>
								{editingResource
									? `Editando: ${editingResource.title}`
									: 'Completa el formulario para crear un nuevo recurso.'}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='title'>Título</Label>
										<Input
											id='title'
											value={title}
											onChange={handleTitleChange}
											placeholder='Título del recurso'
											required
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='slug'>Slug (URL)</Label>
										<Input
											id='slug'
											value={slug}
											onChange={(e) => setSlug(e.target.value)}
											placeholder='slug-del-recurso'
											required
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='category'>Categoría</Label>
									<Select value={category} onValueChange={setCategory}>
										<SelectTrigger>
											<SelectValue placeholder='Selecciona una categoría' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='Guías'>Guías</SelectItem>
											<SelectItem value='Plantillas'>Plantillas</SelectItem>
											<SelectItem value='Herramientas'>Herramientas</SelectItem>
											<SelectItem value='Infografías'>Infografías</SelectItem>
											<SelectItem value='E-books'>E-books</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='description'>Descripción</Label>
									<Textarea
										id='description'
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder='Breve descripción del recurso'
										rows={2}
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='content'>Contenido</Label>
									<div className='border rounded-md overflow-hidden'>
										{!editorLoaded ? (
											<div className='flex items-center justify-center p-8 min-h-[300px]'>
												<Loader2 className='h-8 w-8 animate-spin' />
											</div>
										) : (
											<div
												ref={editorElementRef}
												className='min-h-[300px] p-4'
												dangerouslySetInnerHTML={{ __html: content }}
											></div>
										)}
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										Usa las herramientas de formato para crear contenido rico
										con títulos, listas, imágenes y más.
									</p>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='image'>Imagen</Label>
										<div className='flex items-center gap-4'>
											<Button
												type='button'
												variant='outline'
												onClick={() =>
													document.getElementById('image-upload').click()
												}
											>
												<ImageIcon className='h-4 w-4 mr-2' />
												Seleccionar imagen
											</Button>
											<Input
												id='image-upload'
												type='file'
												accept='image/*'
												onChange={handleImageChange}
												className='hidden'
											/>
											{(imagePreview || imageUrl) && (
												<div className='relative h-20 w-20 rounded overflow-hidden'>
													<img
														src={imagePreview || imageUrl}
														alt='Vista previa'
														className='object-cover h-full w-full'
													/>
												</div>
											)}
										</div>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='file'>Archivo adjunto</Label>
										<div className='flex items-center gap-4'>
											<Button
												type='button'
												variant='outline'
												onClick={() =>
													document.getElementById('file-upload').click()
												}
											>
												<FileTextIcon className='h-4 w-4 mr-2' />
												Seleccionar archivo
											</Button>
											<Input
												id='file-upload'
												type='file'
												onChange={handleFileChange}
												className='hidden'
											/>
											{(fileName || fileUrl) && (
												<div className='text-sm'>
													<span className='font-medium'>Archivo: </span>
													<span className='text-muted-foreground'>
														{fileName || fileUrl.split('/').pop()}
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</form>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button variant='outline' onClick={resetForm}>
								{editingResource ? 'Cancelar edición' : 'Limpiar formulario'}
							</Button>
							<Button onClick={handleSubmit} disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										{editingResource ? 'Actualizando...' : 'Guardando...'}
									</>
								) : editingResource ? (
									'Actualizar recurso'
								) : (
									'Publicar recurso'
								)}
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>

			<style jsx global>{`
				.ck-editor__editable {
					min-height: 300px;
					max-height: 600px;
				}
				.ck-editor__editable_inline {
					padding: 0 1rem;
				}
				.ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
					border-color: var(--border);
				}
				.ck.ck-toolbar {
					border-color: var(--border);
					background: var(--muted);
				}
				.ck.ck-button:not(.ck-disabled):hover,
				.ck.ck-button:not(.ck-disabled).ck-on {
					background: var(--muted-foreground);
				}
			`}</style>
		</>
	);
}


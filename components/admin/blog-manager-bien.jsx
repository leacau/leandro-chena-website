'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Eye, ImageIcon, Loader2, Pencil, Trash } from 'lucide-react';
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

export default function BlogManager() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [content, setContent] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [author, setAuthor] = useState('');
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [editingPost, setEditingPost] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [editorLoaded, setEditorLoaded] = useState(false);
	const [activeTab, setActiveTab] = useState('list');
	const { toast } = useToast();
	const editorRef = useRef(null);
	const editorElementRef = useRef(null);

	// Cargar posts al iniciar
	useEffect(() => {
		loadPosts();
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
					placeholder: 'Escribe el contenido del post aquí...',
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

	// Actualizar el contenido del editor cuando se edita un post
	useEffect(() => {
		if (editorRef.current && editingPost) {
			editorRef.current.setData(content);
		}
	}, [editingPost, content]);

	const loadPosts = async () => {
		try {
			setLoading(true);
			const postsQuery = query(
				collection(db, 'blogPosts'),
				orderBy('createdAt', 'desc')
			);
			const querySnapshot = await getDocs(postsQuery);
			const postsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setPosts(postsData);
		} catch (error) {
			console.error('Error al cargar los posts:', error);
			toast({
				title: 'Error',
				description: 'No se pudieron cargar los posts del blog.',
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
		if (!editingPost || !editingPost.slug) {
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
		setAuthor('');
		setImage(null);
		setImagePreview('');
		setImageUrl('');
		setEditingPost(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !slug || !content) {
			toast({
				title: 'Campos requeridos',
				description: 'Por favor completa al menos título, slug y contenido.',
				variant: 'destructive',
			});
			return;
		}

		try {
			setSubmitting(true);
			let finalImageUrl = imageUrl;

			// Si hay una nueva imagen, subirla a Storage
			if (image) {
				const storageRef = ref(storage, `blog/${slug}-${Date.now()}`);
				await uploadBytes(storageRef, image);
				finalImageUrl = await getDownloadURL(storageRef);
			}

			const postData = {
				title,
				slug,
				content,
				description,
				category,
				author,
				date: new Date().toLocaleDateString('es-AR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}),
				updatedAt: serverTimestamp(),
			};

			if (finalImageUrl) {
				postData.image = finalImageUrl;
			}

			if (editingPost) {
				// Actualizar post existente
				await updateDoc(doc(db, 'blogPosts', editingPost.id), postData);
				toast({
					title: 'Post actualizado',
					description: 'El post ha sido actualizado correctamente.',
				});
			} else {
				// Crear nuevo post
				postData.createdAt = serverTimestamp();
				await addDoc(collection(db, 'blogPosts'), postData);
				toast({
					title: 'Post creado',
					description: 'El post ha sido creado correctamente.',
				});
			}

			resetForm();
			loadPosts();
			setActiveTab('list');
		} catch (error) {
			console.error('Error al guardar el post:', error);
			toast({
				title: 'Error',
				description: 'No se pudo guardar el post. Inténtalo de nuevo.',
				variant: 'destructive',
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleEdit = (post) => {
		setEditingPost(post);
		setTitle(post.title || '');
		setSlug(post.slug || '');
		setContent(post.content || '');
		setDescription(post.description || '');
		setCategory(post.category || '');
		setAuthor(post.author || '');
		setImageUrl(post.image || '');
		setImagePreview(post.image || '');
		setImage(null);

		// Cambiar a la pestaña de edición
		setActiveTab('create');

		// Asegurarse de que el editor esté inicializado y actualizar su contenido
		setTimeout(() => {
			if (editorRef.current) {
				editorRef.current.setData(post.content || '');
			}
		}, 100);
	};

	const handleDelete = async (post) => {
		if (
			!window.confirm(
				`¿Estás seguro de que quieres eliminar el post "${post.title}"?`
			)
		) {
			return;
		}

		try {
			setLoading(true);

			// Eliminar la imagen de Storage si existe
			if (post.image) {
				try {
					// Extraer la ruta de la imagen desde la URL
					const imageUrl = new URL(post.image);
					const pathMatch = imageUrl.pathname.match(/\/o\/(.+?)(?:\?|$)/);

					if (pathMatch && pathMatch[1]) {
						// Decodificar la ruta de la imagen
						const imagePath = decodeURIComponent(pathMatch[1]);
						const imageRef = ref(storage, imagePath);

						// Eliminar la imagen
						await deleteObject(imageRef);
						console.log('Imagen eliminada correctamente de Storage');
					} else {
						// Si no podemos extraer la ruta, intentamos eliminar directamente
						const imageRef = ref(storage, post.image);
						await deleteObject(imageRef);
						console.log(
							'Imagen eliminada correctamente de Storage (método alternativo)'
						);
					}
				} catch (imageError) {
					console.error('Error al eliminar la imagen:', imageError);
					// Continuamos con la eliminación del post aunque falle la eliminación de la imagen
				}
			}

			// Eliminar el post de Firestore
			await deleteDoc(doc(db, 'blogPosts', post.id));

			toast({
				title: 'Post eliminado',
				description: 'El post ha sido eliminado correctamente.',
			});

			// Si estábamos editando este post, resetear el formulario
			if (editingPost && editingPost.id === post.id) {
				resetForm();
			}

			// Recargar la lista de posts
			loadPosts();
		} catch (error) {
			console.error('Error al eliminar el post:', error);
			toast({
				title: 'Error',
				description: 'No se pudo eliminar el post. Inténtalo de nuevo.',
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
					<TabsTrigger value='list'>Lista de Posts</TabsTrigger>
					<TabsTrigger value='create'>Crear/Editar Post</TabsTrigger>
				</TabsList>

				<TabsContent value='list'>
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold'>Posts del Blog</h2>
							<Button onClick={loadPosts} disabled={loading}>
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
						) : posts.length === 0 ? (
							<p className='text-center py-8 text-muted-foreground'>
								No hay posts publicados aún.
							</p>
						) : (
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{posts.map((post) => (
									<Card key={post.id} className='flex flex-col'>
										<CardHeader className='pb-2'>
											<CardTitle className='line-clamp-2'>
												{post.title}
											</CardTitle>
											<CardDescription>
												{post.date} • {post.category || 'Sin categoría'}
											</CardDescription>
										</CardHeader>
										<CardContent className='flex-grow'>
											{post.image && (
												<div className='relative h-40 mb-4 rounded overflow-hidden'>
													<img
														src={post.image || '/placeholder.svg'}
														alt={post.title}
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
												{post.description || 'Sin descripción'}
											</p>
										</CardContent>
										<CardFooter className='flex justify-between pt-2'>
											<div className='flex space-x-2'>
												<Button
													size='sm'
													variant='outline'
													onClick={() => handleEdit(post)}
												>
													<Pencil className='h-4 w-4 mr-1' />
													Editar
												</Button>
												<Button
													size='sm'
													variant='destructive'
													onClick={() => handleDelete(post)}
												>
													<Trash className='h-4 w-4 mr-1' />
													Eliminar
												</Button>
											</div>
											<Button size='sm' variant='ghost' asChild>
												<NextLink href={`/blog/${post.slug}`} target='_blank'>
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
								{editingPost ? 'Editar Post' : 'Crear Nuevo Post'}
							</CardTitle>
							<CardDescription>
								{editingPost
									? `Editando: ${editingPost.title}`
									: 'Completa el formulario para crear un nuevo post en el blog.'}
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
											placeholder='Título del post'
											required
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='slug'>Slug (URL)</Label>
										<Input
											id='slug'
											value={slug}
											onChange={(e) => setSlug(e.target.value)}
											placeholder='slug-del-post'
											required
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='category'>Categoría</Label>
										<Select value={category} onValueChange={setCategory}>
											<SelectTrigger>
												<SelectValue placeholder='Selecciona una categoría' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='Ventas'>Ventas</SelectItem>
												<SelectItem value='Liderazgo'>Liderazgo</SelectItem>
												<SelectItem value='Capacitación'>
													Capacitación
												</SelectItem>
												<SelectItem value='Motivación'>Motivación</SelectItem>
												<SelectItem value='Desarrollo Personal'>
													Desarrollo Personal
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='author'>Autor</Label>
										<Input
											id='author'
											value={author}
											onChange={(e) => setAuthor(e.target.value)}
											placeholder='Nombre del autor'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='description'>Descripción</Label>
									<Textarea
										id='description'
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder='Breve descripción del post'
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

								<div className='space-y-2'>
									<Label htmlFor='image'>Imagen de portada</Label>
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
							</form>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button variant='outline' onClick={resetForm}>
								{editingPost ? 'Cancelar edición' : 'Limpiar formulario'}
							</Button>
							<Button onClick={handleSubmit} disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										{editingPost ? 'Actualizando...' : 'Guardando...'}
									</>
								) : editingPost ? (
									'Actualizar post'
								) : (
									'Publicar post'
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


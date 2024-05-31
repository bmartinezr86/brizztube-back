import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/modules/shared/services/comment/comment.service';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  public commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public commentForm!: FormGroup;
  private fb = inject(FormBuilder);
  public dialog = inject(MatDialog);
  public location = inject(Location);
  editedCommentId: number | null = null;
  editedCommentText: string = '';
  currentUser: any;
  comments: any;
  countComments = 0;
  commentsToShow: number = 10;
  displayedComments: any[] = [];
  videoOwnerId: number | null = null;
  @Input() videoIdComments: string | undefined;
  videoId: any;

  ngOnInit(): void {
    const currentUrl = this.location.path();
    if (currentUrl.startsWith('/dashboard/videos')) {
      this.videoId = this.route.snapshot.params['id'];
    } else {
      this.videoId = this.videoIdComments;
    }
    // console.log(currentUrl);
    this.currentUser = this.userService.getCurrentUser();
    this.commentForm = this.fb.group({
      comentario: ['', Validators.required],
    });
    this.loadComments(this.videoId);
  }

  onSave() {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    if (this.commentForm.invalid) {
      return;
    }

    let data = {
      text: this.commentForm.get('comentario')?.value,
    };
    const createComment = new FormData();
    createComment.append('userId', this.currentUser.id);
    createComment.append('videoId', this.videoId);
    createComment.append('text', data.text);

    this.commentService.create(createComment).subscribe(
      () => {
        this.snackBar.open('Comentario enviado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error('Error al enviar el comentario:', error);
        this.snackBar.open('Error al enviar el comentario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  loadComments(videoId: any): void {
    // const videoId = this.route.snapshot.params['id'];
    this.commentService.listCommentToVideoId(videoId).subscribe(
      (response: any) => {
        if (
          response &&
          response.commentResponse &&
          response.commentResponse.comment
        ) {
          this.comments = response.commentResponse.comment;
          this.countComments = this.comments.length;
          this.updateDisplayedComments();
        }
      },
      (error: any) => {
        console.error('Error al cargar comentarios:', error);
      }
    );
  }

  onCancel() {
    this.commentForm.reset(); // Restablecer el formulario a su estado inicial
  }

  getAvatarUrl(avatarLocation: string): string {
    return `http://localhost:8080${avatarLocation}`;
  }

  formatDistanceToNow(date: any): string {
    const distance = distanceToNow(date, {
      locale: es,
      includeSeconds: true,
    });
    if (distance) {
      // Eliminar "alrededor de" de la cadena y devolver solo "hace X tiempo"
      return distance.replace('alrededor de', '');
    } else {
      return '';
    }
  }

  updateDisplayedComments() {
    this.displayedComments = this.comments.slice(0, this.commentsToShow);
  }

  showMoreComments() {
    this.commentsToShow += 5;
    this.updateDisplayedComments();
  }

  showLessComments() {
    this.commentsToShow = Math.max(this.commentsToShow - 5, 10); // Ensure it doesn't go below 10
    this.updateDisplayedComments();
  }
  editComment(comment: any) {
    this.editedCommentId = comment.id;
    this.editedCommentText = comment.text;
  }

  saveEditedComment(commentId: number) {
    console.log(this.editedCommentText);
    // Verificar si el texto del comentario editado es válido
    if (!this.editedCommentText || this.editedCommentText.trim() === '') {
      this.snackBar.open('El comentario no puede estar vacío', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    // Crear el objeto de datos para la edición del comentario
    const data = {
      text: this.editedCommentText,
    };

    const updateComment = new FormData();
    updateComment.append('text', data.text);
    // Llamar al servicio para editar el comentario
    this.commentService.modify(updateComment, commentId).subscribe(
      () => {
        // Mostrar mensaje de éxito
        this.snackBar.open('Comentario editado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        // Limpiar la edición y cargar los comentarios actualizados
        this.cancelEdit();
        this.loadComments(this.videoId);
      },
      (error: any) => {
        // Mostrar mensaje de error si falla la edición
        console.error('Error al editar el comentario:', error);
        this.snackBar.open('Error al editar el comentario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  cancelEdit() {
    this.editedCommentId = null;
    this.editedCommentText = '';
  }

  deleteComment(commentId: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      data: {
        id: commentId,
        type: 'deleteComment',
        message: '¿Estás seguro de eliminar el comentario?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('El comentario ha sido eliminado', 'Exitosa');
        this.loadComments(this.videoId);
      } else if (result === 2) {
        this.openSnackBar(
          'Se ha producido un error al eliminar el comentario',
          'Error'
        );
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

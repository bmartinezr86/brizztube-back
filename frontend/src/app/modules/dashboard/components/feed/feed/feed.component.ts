import { Component, OnInit, inject } from '@angular/core';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  videoService = inject(VideoService);
  categoryId: any; // Variable para almacenar el ID de la categoría
  categoryTitle: string = ''; // Variable para almacenar el título de la categoría
  videos: any[] = []; // Arreglo para almacenar los videos relacionados con la categoría
  router: any;
  categories: any[] = []; // Variable para almacenar las categorías
  videosByCategory: Map<string, any[]> = new Map<string, any[]>(); // Variable para almacenar los videos por categoría
  loadedVideosCount: number = 4;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.videoService.getCategories().subscribe(
      (response: any) => {
        if (
          response &&
          response.categoryResponse &&
          response.categoryResponse.category
        ) {
          this.categories = response.categoryResponse.category;

          // Una vez que tenemos las categorías, cargamos los videos para cada categoría
          this.loadVideosForCategories();
        } else {
          console.log('No categories found');
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadVideosForCategories(): void {
    // Iteramos sobre cada categoría y cargamos los videos correspondientes
    this.categories.forEach((category) => {
      this.videoService.searchVideoByCategoryId(category.id).subscribe(
        (response: any) => {
          if (
            response &&
            response.videoResponse &&
            response.videoResponse.video
          ) {
            // Agregamos los videos a la lista de videos por categoría
            this.videosByCategory.set(
              category.name,
              response.videoResponse.video
            );

            // console.log(this.videosByCategory);
          }
        },
        (error) => {
          console.error(
            `Error fetching videos for category ${category.name}:`,
            error
          );
        }
      );
    });
  }

  loadMoreVideos() {
    this.loadedVideosCount += 4; // Aumenta la cantidad de videos cargados en 4
  }

  getVideoThumbnailUrl(thumbnailLocation: string): string {
    return `http://localhost:8080${thumbnailLocation}`;
  }
  getVideoUrl(videoLocation: string): string {
    return `http://localhost:8080${videoLocation}`;
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
}

interface Category {
  id: number;
  name: string;
  description: string;
}

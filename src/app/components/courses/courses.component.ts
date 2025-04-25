import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../add-course/add-course.component';
import { Course } from '../../Services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, OnDestroy {

  categories: Category[] | null = null;
  courses: Course[] | null = null;
  selectedCategoryId: number | null = null;
  filteredCourses: Course[] | null = null;
  learnerCounts: { [categoryId: number]: string } = {};

  images: string[] = [
    'https://img-c.udemycdn.com/notices/web_carousel_slide/image/3d5da4b4-da7b-4b66-91db-6ea75f1b82a6.png',
    'https://img-c.udemycdn.com/notices/web_carousel_slide/image/9652f354-5e37-400c-856e-ee28f98f27d6.png',
    'https://img-c.udemycdn.com/notices/web_carousel_slide/image/e6cc1a30-2dec-4dc5-b0f2-c5b656909d5b.jpg',
    'https://img-c.udemycdn.com/notices/featured_carousel_slide/image/3176dcbd-af50-456c-b65c-51098943bece.webp',
    'https://img-c.udemycdn.com/notices/featured_carousel_slide/image/26eddc87-5b5b-4c4c-9adb-8bf99395b480.jpg',
    'https://img-c.udemycdn.com/notices/featured_carousel_slide/image/a4978aa7-e7dc-43d8-a76e-65a14cf84445.jpg'
  ];
  currentImageIndex = 0;
  currentImage = this.images[0];
  private intervalId: any;

  selectedImage = 'https://cms-images.udemycdn.com/96883mtakkm8/4kbyXne3Slx9Sfz4nTBqdf/8ac2b75db1a118f15e2fb5dfe2bb4567/desktop-hands-on-learning-2x.png';

  goals = [
    {
      title: 'Hands-on training',
      desc: 'Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.',
      image: 'https://cms-images.udemycdn.com/96883mtakkm8/4kbyXne3Slx9Sfz4nTBqdf/8ac2b75db1a118f15e2fb5dfe2bb4567/desktop-hands-on-learning-2x.png',
      icon: 'https://cms-images.udemycdn.com/96883mtakkm8/7kN9RBFSMFNHzsGWsElMPi/dde73f8d1c47e046f035274e78410590/hands-on-practice.png',
    },
    {
      title: 'Certification prep',
      desc: 'Prep for industry-recognized certifications and earn badges along the way.',
      image: 'https://cms-images.udemycdn.com/96883mtakkm8/GUVYFTj0uwEQuJha5j7TZ/473be949e2751dd5826b141dc4c16892/desktop-certification-prep-2x.png',
      icon: 'https://cms-images.udemycdn.com/96883mtakkm8/2Xh9YHJustDwCEjn5IlO25/93e9b15c6e74876db0dec63466fcc5a0/certificate.png',
    },
    {
      title: 'Insights and analytics',
      desc: 'Advanced insights and a dedicated customer success team.',
      image: 'https://cms-images.udemycdn.com/96883mtakkm8/6q4N9BvIQusFoheoALJhGj/678c1a0bb6c2a22d95461d409492231e/desktop-insights-and-analytics-2x.png',
      icon: 'https://cms-images.udemycdn.com/96883mtakkm8/6w8plrr7vY9rIY46UuX0q5/2f0a3f0c22e99bd2d430b998c81321f2/empty-state-1.png',
      badge: 'Enterprise only'
    },
    {
      title: 'Customizable content',
      desc: 'Create tailored learning paths and host your own content.',
      image: 'https://cms-images.udemycdn.com/96883mtakkm8/385IhnON960Wvz50ooWIN3/d4e6738c97769258d387b3d609edaad4/desktop-customizable-2x.png',
      icon: 'https://cms-images.udemycdn.com/96883mtakkm8/2tKGBrb1N60wox2Lh8j3tz/7f1528c9f88ea47bd6ebb46f345902c3/organizations-2.png',
      badge: 'Enterprise plan'
    }
  ];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    this.courses = this.route.snapshot.data['courses'] ?? null;
    this.categories = this.route.snapshot.data['categories'] ?? null;

    // Assign random rating if null
    if (this.courses) {
      this.courses.forEach(course => {
        if (course.rating == null) {
          course.rating = this.getRandomRating(3, 5);
        }
      });
    }

    if (this.categories && this.categories.length > 0) {
      this.selectedCategoryId = this.categories[0].categorieId;
      this.filteredCourses = this.courses?.filter(course => course.categoriesId === this.selectedCategoryId) ?? null;
      this.generateRandomLearnerCounts();
    }
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentImageIndex];
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getRandomRating(min: number, max: number): number {
    return +((Math.random() * (max - min) + min).toFixed(1));
  }

  generateRandomLearnerCounts(): void {
    if (!this.categories) return;

    this.categories.forEach(category => {
      const randomMillions = (Math.random() * (5 - 1.5) + 1.5).toFixed(1);
      this.learnerCounts[category.categorieId] = `${randomMillions}M+ learners`;
    });
  }

  onCategoryChange(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.filteredCourses = this.courses?.filter(course => course.categoriesId === categoryId) ?? null;
  }

  getStarRating(rating: number): { stars: string, display: string } {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    stars += '★'.repeat(fullStars);
    stars += '☆'.repeat(emptyStars);

    const display = `${rating} ${stars}`;
    return { stars, display };
  }

  setActive(imagePath: string): void {
    this.selectedImage = imagePath;
  }

  goToCourse(courseId: number): void {
    this.router.navigate(['courses', 'coursePage', courseId]);
  }
}

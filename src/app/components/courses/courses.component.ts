import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, OnDestroy {
  
  constructor(private router: Router) {}

    categories = [
      {
        name: 'Deep Learning',
        learners: '2M+ learners',
        courses: [
          {
            name: 'Deep Learning A-Z 2025: Neural Networks, AI & ChatGPT Prize',
            price: '£449.99',
            image: 'https://tse2.mm.bing.net/th?id=OIP.l3ehPyHJOAEzxXbNjJAUZgHaEX&pid=Api&P=0&h=220',
            description: 'Neural Networks, AI & ChatGPT — all in one practical course!',
            rating: 4.5,
            tag: 'Bestseller',
            sections: [
              {
                title: 'Introduction to Deep Learning',
                videos: [
                  { name: 'What is Deep Learning?', time: '5:12' },
                  { name: 'Neural Networks Basics', time: '8:45' }
                ]
              },
              {
                title: 'Building Neural Networks',
                videos: [
                  { name: 'Activation Functions', time: '6:34' },
                  { name: 'Backpropagation Explained', time: '10:22' }
                ]
              }
            ]
          },
          {
            name: 'Python for Deep Learning: Build Neural Networks in Python',
            price: '£249.99',
            image: 'https://cienciadedadosbrasil.com.br/wp-content/uploads/2023/08/PYTHON-1024x576.png',
            description: 'Learn deep learning from scratch using Python.',
            rating: 4.5,
            sections: [
              {
                title: 'Python Basics',
                videos: [
                  { name: 'Installing Python', time: '3:20' },
                  { name: 'Data Types and Variables', time: '7:10' }
                ]
              },
              {
                title: 'Deep Learning Models',
                videos: [
                  { name: 'Understanding Layers', time: '5:45' },
                  { name: 'Creating Models with Keras', time: '9:30' }
                ]
              }
            ]
          }
        ]
      },
  
      {
        name: 'Machine Learning',
        learners: '8M+ learners',
        courses: [
          {
            name: 'Complete Machine Learning Bootcamp',
            price: '£299.99',
            image: 'https://miro.medium.com/v2/resize:fit:1200/1*ikEB53J-pPJCXy1Ub1XUsQ.jpeg',
            description: 'A full bootcamp to become a Machine Learning engineer.',
            rating: 4.7,
            sections: [
              {
                title: 'ML Basics',
                videos: [
                  { name: 'What is Machine Learning?', time: '6:12' },
                  { name: 'Types of Machine Learning', time: '10:50' }
                ]
              },
              {
                title: 'ML Algorithms',
                videos: [
                  { name: 'Linear Regression', time: '12:30' },
                  { name: 'Decision Trees', time: '11:10' }
                ]
              }
            ]
          }
        ]
      }
    ];

    images: string[] = [
      'https://img-c.udemycdn.com/notices/web_carousel_slide/image/3d5da4b4-da7b-4b66-91db-6ea75f1b82a6.png',
      'https://img-c.udemycdn.com/notices/web_carousel_slide/image/9652f354-5e37-400c-856e-ee28f98f27d6.png',
      'https://i.pinimg.com/originals/dc/55/a7/dc55a7baa9cbd457221ae6d12d9b1b51.jpg'
    ];
  
    currentImageIndex = 0;
    currentImage = this.images[0];
    private intervalId: any;
  
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

    selectedCategory = this.categories[0];
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
  
    setActive(imagePath: string): void {
      this.selectedImage = imagePath;
    }
    
    goToCourse(course: any, category: string) {
      this.router.navigate(['/courses', course.name], {
        state: {
          course,
          categories: this.categories,
        }
      });
    }    

  }
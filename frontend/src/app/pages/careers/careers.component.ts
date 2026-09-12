import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: string; // Full-Time, Part-Time, Free Student Internship
  location: string;
  description: string;
  requirements: string[];
}

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="legal-page-wrap">
      <!-- Header -->
      <div class="legal-header text-center">
        <span class="badge-gold">JOIN OUR CREATIVE ATELIER</span>
        <h1 class="font-serif page-title mt-2">Careers at Jhulki</h1>
        <p class="subtitle">Building a vibrant community of passionate artisans, visionaries, designers, and master tailors.</p>
      </div>

      <!-- Main Box Container -->
      <div class="legal-card glass-card mt-5">
        
        <!-- Intro & Pillars Grid -->
        <div class="intro-block mb-6 border-b border-amber-500/20 pb-6">
          <p class="lead-text text-center">
            At <strong>Jhulki</strong>, we aren't just creating apparel — we are nurturing a community dedicated to preserving India's rich textile heritage while reinventing modern fashion.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="pillar-box">
              <h4 class="font-serif gold-text text-base mb-1">Heritage Preservation</h4>
              <p class="text-xs text-gray-300">Empowering local weavers, embroiderers, and craftsmen through direct atelier partnerships.</p>
            </div>
            <div class="pillar-box">
              <h4 class="font-serif gold-text text-base mb-1">Creative Freedom</h4>
              <p class="text-xs text-gray-300">A collaborative atmosphere where innovative designs and traditional arts meet seamlessly.</p>
            </div>
            <div class="pillar-box">
              <h4 class="font-serif gold-text text-base mb-1">Student Internships</h4>
              <p class="text-xs text-gray-300">Free hands-on educational internship programs for fashion design and tailoring students.</p>
            </div>
          </div>
        </div>

        <!-- Open Opportunities Header -->
        <div class="mb-6">
          <h2 class="font-serif section-title gold-text">Open Positions</h2>
          <p class="text-xs text-gray-400">Explore opportunities across design, tailoring, production, and student internships.</p>
        </div>

        <!-- Positions List -->
        <div class="space-y-4 mb-8">
          <div *ngFor="let job of positions" class="job-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div class="space-y-2 max-w-2xl">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-lg font-serif text-white">{{ job.title }}</h3>
                <span class="badge-gold" style="font-size: 10px; padding: 2px 8px;">
                  {{ job.type }}
                </span>
                <span class="text-xs text-gray-400 border-l border-amber-500/20 pl-2">
                  {{ job.location }}
                </span>
              </div>
              <p class="text-xs text-gray-300 leading-relaxed">
                {{ job.description }}
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                <span *ngFor="let req of job.requirements" class="text-[11px] px-2.5 py-1 rounded bg-black border border-amber-500/20 text-gray-300">
                  • {{ req }}
                </span>
              </div>
            </div>

            <div class="shrink-0">
              <button (click)="openApplyModal(job)" class="luxury-btn-primary" style="padding: 10px 20px; font-size: 0.75rem;">
                APPLY NOW
              </button>
            </div>

          </div>
        </div>

        <!-- Spontaneous Application Card -->
        <div class="pillar-box text-center py-6">
          <h4 class="font-serif gold-text text-lg mb-1">Don't See Your Role Listed?</h4>
          <p class="text-xs text-gray-400 max-w-xl mx-auto mb-4">
            We are always eager to connect with talented craftsmen, fashion stylists, and student interns. Send us a general application!
          </p>
          <button (click)="openApplyModal(generalPosition)" class="luxury-btn-outline" style="padding: 10px 24px; font-size: 0.75rem;">
            SUBMIT GENERAL APPLICATION
          </button>
        </div>

      </div>

      <!-- Application Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="modal-card glass-card max-w-lg w-full relative p-8 space-y-4">
          
          <button (click)="closeModal()" class="close-btn absolute top-4 right-4">&times;</button>

          <div *ngIf="applicationSubmitted" class="text-center py-8 space-y-3">
            <div class="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 mx-auto flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 class="text-xl font-serif gold-text">Application Submitted!</h3>
            <p class="text-xs text-gray-300 leading-relaxed">
              Thank you for applying for <strong class="text-amber-300">{{ selectedJob?.title }}</strong>. Our HR and atelier team will connect with you soon.
            </p>
            <button (click)="closeModal()" class="luxury-btn-primary mt-3" style="padding: 10px 24px; font-size: 0.75rem;">
              CLOSE WINDOW
            </button>
          </div>

          <form *ngIf="!applicationSubmitted" (ngSubmit)="submitApplication()" class="space-y-4">
            <div class="border-b border-amber-500/20 pb-3">
              <span class="badge-gold" style="font-size: 9px; padding: 2px 6px;">APPLICATION FORM</span>
              <h3 class="text-lg font-serif gold-text mt-1">{{ selectedJob?.title }}</h3>
            </div>

            <div class="form-group">
              <label>FULL NAME *</label>
              <input type="text" [(ngModel)]="applicant.name" name="app_name" required placeholder="Enter your full name" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label>EMAIL ADDRESS *</label>
                <input type="email" [(ngModel)]="applicant.email" name="app_email" required placeholder="name&#64;example.com" />
              </div>
              <div class="form-group">
                <label>PHONE NUMBER *</label>
                <input type="tel" [(ngModel)]="applicant.phone" name="app_phone" required placeholder="+91 98765 43210" />
              </div>
            </div>

            <div class="form-group">
              <label>PORTFOLIO / RESUME LINK</label>
              <input type="url" [(ngModel)]="applicant.portfolio" name="app_portfolio" placeholder="https://drive.google.com/..." />
            </div>

            <div class="form-group">
              <label>BRIEF INTRODUCTION / COVER NOTE *</label>
              <textarea [(ngModel)]="applicant.notes" name="app_notes" rows="3" required placeholder="Tell us about your experience or why you'd like to join Jhulki..."></textarea>
            </div>

            <button type="submit" class="luxury-btn-primary submit-btn">
              SUBMIT APPLICATION
            </button>
          </form>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .legal-page-wrap {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 24px 100px;
    }
    .page-title {
      font-size: 2.5rem;
      color: #fff;
    }
    .subtitle {
      color: #9a9ab0;
      font-size: 0.95rem;
    }
    .legal-card {
      padding: 40px 36px;
      border: 1px solid rgba(212, 175, 55, 0.25);
      color: #ccc;
      line-height: 1.8;
      font-size: 0.95rem;
    }
    .lead-text {
      font-size: 1.05rem;
      color: #f3e5ab;
      line-height: 1.7;
    }
    .section-title {
      font-size: 1.3rem;
      margin-bottom: 6px;
    }
    .pillar-box {
      background: rgba(0, 0, 0, 0.4);
      padding: 20px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
    .job-card {
      background: rgba(0, 0, 0, 0.5);
      padding: 22px;
      border-radius: 6px;
      border: 1px solid rgba(212, 175, 55, 0.2);
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .job-card:hover {
      border-color: rgba(212, 175, 55, 0.4);
    }
    .form-group label {
      display: block;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: #888;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      background: #000000;
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #fff;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: var(--color-gold-primary);
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.2);
    }
    .submit-btn {
      width: 100%;
      padding: 14px;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      margin-top: 8px;
    }
    .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-card {
      background: #0d0d12;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 8px;
    }
    @media (max-width: 768px) {
      .legal-card {
        padding: 24px 18px;
      }
      .page-title {
        font-size: 1.8rem;
      }
    }
  `]
})
export class CareersComponent {
  positions: JobPosition[] = [
    {
      id: 'fashion-designer',
      title: 'Senior Fashion Designer (Ethnic & Bespoke)',
      department: 'Design',
      type: 'Full-Time',
      location: 'Studio / Hybrid',
      description: 'Lead design concepts for luxury Bandhani, Chikankari, and Chaniya Choli collections. Collaborate directly with master weavers.',
      requirements: ['3+ years in Indian ethnic wear', 'Draping & pattern mastery', 'Tech pack design']
    },
    {
      id: 'master-tailor',
      title: 'Master Tailor & Pattern Maker',
      department: 'Production',
      type: 'Full-Time',
      location: 'Atelier Studio',
      description: 'Craft high-precision cuts and intricate fits for bespoke bridal and festive ethnic wear.',
      requirements: ['5+ years tailoring expertise', 'Embroidery alignment', 'Quality craftsmanship']
    },
    {
      id: 'student-intern-designer',
      title: 'Fashion Design & Styling Intern',
      department: 'Design & Styling',
      type: 'Free Student Internship',
      location: 'Studio Internship',
      description: 'Hands-on learning opportunity for fashion design students to shadow senior stylists, assist in moodboard creation, and explore traditional Indian textiles.',
      requirements: ['Fashion student / recent grad', 'Passion for Indian heritage fabrics', 'Basic sketching & Adobe Suite']
    },
    {
      id: 'student-intern-tailor',
      title: 'Apparel Production & Tailoring Intern',
      department: 'Production',
      type: 'Free Student Internship',
      location: 'Atelier Internship',
      description: 'Learn classical stitching techniques, finishing, and garment assembly from our master artisans.',
      requirements: ['Interest in garment construction', 'Attention to detail', 'Eager to learn']
    }
  ];

  generalPosition: JobPosition = {
    id: 'general',
    title: 'General Candidate Application',
    department: 'General',
    type: 'Full / Part-Time / Internship',
    location: 'Any',
    description: 'General application to join the Jhulki team.',
    requirements: []
  };

  showModal = false;
  selectedJob: JobPosition | null = null;
  applicationSubmitted = false;

  applicant = {
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    notes: ''
  };

  openApplyModal(job: JobPosition) {
    this.selectedJob = job;
    this.showModal = true;
    this.applicationSubmitted = false;
    this.applicant = { name: '', email: '', phone: '', portfolio: '', notes: '' };
  }

  closeModal() {
    this.showModal = false;
    this.selectedJob = null;
  }

  submitApplication() {
    if (this.applicant.name && this.applicant.email && this.applicant.phone) {
      this.applicationSubmitted = true;
    }
  }
}

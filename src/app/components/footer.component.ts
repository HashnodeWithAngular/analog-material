import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BlogInfo } from '../models/blog-info';
import { BlogService } from '../services/blog.service';


@Component({
	selector: "app-footer",
	standalone: true,
	imports: [MatToolbarModule],
	template: `
		@if (showMainFooter) {
		<mat-toolbar class="footer">
			<p>&copy; {{ date }} {{ blogName }}</p>
			<small
				>Created using<a href="https://github.com/HashnodeWithAngular" target="_blank"
					>HashnodeWithAngular</a
				> and<a href="https://analogjs.org" target="_blank"
					>Analog</a
				></small
			>
		</mat-toolbar>
		}
	`,
	styles: [
		`
			.footer {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: space-between;
				height: 6rem;
				padding: 1rem;

				p,
				small {
					text-align: center;
					width: 100%;
					margin: 0;
					padding: 0;
				}

				p {
					font-size: 1rem;
				}

				small {
					color: #999999;
					font-size: 0.8rem;
				}

        a {
          margin-left: 0.2rem;
        }
			}
		`,
	],
})
export class FooterComponent implements OnInit, OnDestroy {
  showMainFooter: boolean = true;
  blogURL!: string;
  blogInfo!: BlogInfo;
  blogName = '';
  date = new Date().getFullYear();
  blogService: BlogService = inject(BlogService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
  private querySubscription?: Subscription;

  ngOnInit(): void {
    this.blogURL = this.blogService.getBlogURL();
    this.querySubscription = this.blogService.getBlogInfo(this.blogURL).subscribe((data) => {
      this.blogInfo = data;
      this.blogName = this.blogInfo.title;
    });
    this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.showMainFooter =
					!this.route.snapshot.firstChild?.paramMap.has("postSlug");
			}
		});
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }
}

import {
	Component,
	Inject,
	inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
} from "@angular/core";

import { BlogInfo, BlogLinks } from "../models/blog-info";
import { SeriesList } from "../models/post";
import { KeyValuePipe } from "@angular/common";

import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterLink,
} from "@angular/router";

import { MatDialog } from "@angular/material/dialog";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Subscription } from "rxjs";
import { platformBrowser } from "@angular/platform-browser";
import { BlogService } from "../services/blog.service";
import { BlogSocialIconsComponent } from "../partials/blog-social-icons.component";
import { SearchDialogComponent } from "../partials/search-dialog.component";
import { SettingsDialogComponent } from "../partials/settings-dialog.component";
import { FollowDialogComponent } from "../partials/follow-dialog.component";

@Component({
	selector: "app-header",
	standalone: true,
	imports: [
    BlogSocialIconsComponent,
    SearchDialogComponent,
    SettingsDialogComponent,
    FollowDialogComponent,
		KeyValuePipe,
		RouterLink,
		MatSlideToggleModule,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
	],
	template: `@if (showMainHeader) {
    <mat-toolbar>
      <mat-toolbar-row class="first">
        <a routerLink="/" class="blog-title">
          <img src="{{blogImage}}" alt="logo" />
          <h1>{{ blogName }}</h1>
        </a>
        <div class="controls">
          <button mat-mini-fab class="control-button" (click)="openSearchDialog()">
            <mat-icon>search</mat-icon>
          </button>
          <button mat-mini-fab class="control-button" (click)="openSettingsDialog()">
            <mat-icon>settings</mat-icon>
          </button>
        </div>
      </mat-toolbar-row>
      <mat-toolbar-row class="second">
        <div class="social">
          <app-blog-social-icons [blogSocialLinks]="blogSocialLinks"></app-blog-social-icons>
        </div>
        <div class="follow">
          <button mat-raised-button (click)="openFollowDialog()">Follow</button>
        </div>
      </mat-toolbar-row>
      <mat-toolbar-row class="third">
        <div class="series">
          @for (series of seriesList; track series) {
          <a [routerLink]="['series/', series.slug]" class="series-link">{{ series.name }}</a>
          }
        </div>
      </mat-toolbar-row>
    </mat-toolbar>
    }
    `,
	styles: [
		`
			mat-toolbar {
				padding: 1rem 1rem 0.3rem;

				mat-toolbar-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 3.2rem;

					&.second {
						border-bottom: 1px solid #80808050;
					}

					a {
						color: inherit;
						text-decoration: none;
						margin: 0 0.3rem;
					}

					.blog-title {
						display: flex;
						align-items: center;

						img {
							width: 3rem;
							height: 3rem;
							margin-right: 0.5rem;
							border-radius: 50%;
						}

						h1 {
							font-size: 1.3rem;
							font-weight: 400;
							margin: 0;
						}
					}

					.controls {
						display: flex;
						align-items: center;
						justify-content: center;

						.control-button {
							margin-right: 0.6rem;
						}
					}

					.follow {
						button {
							margin-bottom: 0.5rem;
						}
					}

					.series {
						display: flex;
						justify-content: center;
						width: 100%;
						padding: 0.7rem 0;

						a {
							font-size: 1.1rem;
							text-transform: uppercase;
						}
					}
				}
			}

			@media (max-width: 600px) {
				mat-toolbar {
					padding: 0;

					mat-toolbar-row {
						height: 4rem;
						padding: 0;

						&.first {
							width: 94%;
							margin: 0 0.7rem;

							.blog-title {
								img {
									width: 2rem;
									height: 2rem;
									margin-right: 0.3rem;
								}

								h1 {
									font-size: 1.1rem;
								}
							}
						}

						&.second {
							flex-direction: column;
							height: 6rem;

							button {
								font-size: 1rem;
							}
						}

						&.third {
							flex-direction: column;
							height: 7rem;

							// will have to be adjusted to a dropdown
							// to handle cases where there are more than 3 series
							.series {
								flex-direction: column;
								align-items: center;
								margin-bottom: 0.8rem;
							}
						}

						mat-toolbar-row-start {
							.menu {
								span {
									font-size: 1.3rem;
								}
							}
						}

						.toolbar-row-end {
							.follow {
								margin: 1rem 0;
							}
						}
					}
				}
			}
		`,
	],
})
export class HeaderComponent implements OnInit, OnDestroy {
	showMainHeader: boolean = true;
	switchIcons: any;
	blogURL!: string;
	blogInfo!: BlogInfo;
	blogName: string = "";
	// start with default image to prevent 404 when returning from post-details page
	blogImage: string = "/images/anguhashblog-logo-purple-bgr.jpg";
	blogSocialLinks!: BlogLinks;
	seriesList!: SeriesList[];
	blogService: BlogService = inject(BlogService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private querySubscription?: Subscription;

	constructor(
		public dialog: MatDialog,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		this.querySubscription = this.blogService
			.getBlogInfo(this.blogURL)
			.subscribe((data) => {
				this.blogInfo = data;
				this.blogName = this.blogInfo.title;
				if (this.blogInfo.isTeam && this.blogInfo.favicon) {
					this.blogImage = this.blogInfo.favicon;
				} else {
					this.blogImage = "/images/anguhashblog-logo-purple-bgr.jpg";
				}
				if (!this.blogInfo.isTeam) {
					this.blogService.getAuthorInfo(this.blogURL).subscribe((data) => {
						if (data.profilePicture) {
							this.blogImage = data.profilePicture;
						} else {
							this.blogImage =
								"/images/anguhashblog-logo-purple-bgr.jpg";
						}
					});
				}
				const { __typename, ...links } = data.links;
				this.blogSocialLinks = links;
			});

		this.blogService.getSeriesList(this.blogURL).subscribe((data) => {
			this.seriesList = data;
		});
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.showMainHeader =
					!this.route.snapshot.firstChild?.paramMap.has("postSlug");
			}
		});
	}

	openSearchDialog() {
		this.dialog.open(SearchDialogComponent, {
			id: "searchDialog",
			width: "60%",
			maxHeight: "70%",
			position: { top: "150px" },
			data: this.blogInfo.id,
		});
	}

	openSettingsDialog() {
		this.dialog.open(SettingsDialogComponent, {
			height: "45vh",
			width: "26vw",
		});
	}

	openFollowDialog() {
		this.dialog.open(FollowDialogComponent, {
			height: "50vh",
			width: "26vw",
		});
	}

	ngOnDestroy(): void {
		this.querySubscription?.unsubscribe();
	}
}

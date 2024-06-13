import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterLink,
} from "@angular/router";
import { Subscription } from "rxjs";
import { BlogInfo, BlogLinks } from "../models/blog-info";
import { SeriesList } from "../models/post";
import { KeyValuePipe } from "@angular/common";

@Component({
	selector: "app-header",
	standalone: true,
	imports: [KeyValuePipe, RouterLink],
	template: `
		<div class="toolbar" role="banner">
			<div class="toolbar-row first">
				<div class="toolbar-row-start">
					<a routerLink="/" class="blog-title">
						<img
							class="logo-image"
							src="{{blogImage}}"
							alt="logo"
						/>
					</a>
					<a routerLink="/" class="blog-title">
						<h1>AnguHashBlog</h1>
					</a>
				</div>
				<div class="toolbar-row-end">
					<div class="controls">
						<div class="search">
							<button>
								<span class="material-symbols-outlined"> search </span>
							</button>
						</div>
						<div class="settings">
							<button>
								<span class="material-symbols-outlined"> settings </span>
							</button>
						</div>
						<div class="theme-control">
							<button>
								<span class="material-symbols-outlined"> dark_mode </span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="toolbar-row second">
				<div class="toolbar-row-start">
					<div class="social">
						<div class="social-link">
							@for (social of blogSocialLinks | keyvalue; track social) {
                @if (social.value) {
							<a
								href="{{ social.value }}"
								target="_blank"
								rel="noopener noreferrer"
							>
								<!-- <app-svg-icon [icon]="social.key"></app-svg-icon> -->
							</a>
							 }
             }
						</div>
					</div>
				</div>
				<div class="toolbar-row-end">
					<div class="follow">
						<button>Follow</button>
					</div>
				</div>
			</div>
			<div class="toolbar-row third">
				<div class="series">
					@for (series of seriesList; track series) {
					<a [routerLink]="['series', series.slug]" class="series-link">{{
						series.name
					}}</a>
					}
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.toolbar {
				background-color: #252525;
				position: relative;
				padding: 1rem;
				z-index: 3;

				.toolbar-row {
					display: flex;
					align-items: center;
					justify-content: space-between;

					&.second {
						padding: 0.2rem 0 0.5rem;
						border-bottom: 1px solid #80808050;
					}

					.toolbar-row-start {
						display: flex;

						.logo-image {
							width: 3rem;
							height: 3rem;
							margin-right: 0.5rem;
							border-radius: 50%;
						}

						.menu {
							display: flex;
							align-items: center;
							margin-right: 0.7rem;
							cursor: pointer;
						}

						.blog-title {
							display: flex;
							align-items: center;
							cursor: pointer;

							h1 {
								font-size: 1.3rem;
								font-weight: 400;
								margin: 0;
							}
						}

						.social {
							display: flex;
							align-items: flex-start;
							justify-content: center;
							margin: 0.8rem 0 0.5rem;

							.social-link {
								display: flex;

								a {
									margin: 0 0.4rem;
								}
							}
						}
					}

					.toolbar-row-end {
						.controls {
							display: flex;

							div {
								padding: 0 0.2rem;
							}

							.theme-control {
								display: flex;
								align-items: center;
							}
						}

						.follow {
							button {
								font-size: 1.1rem;
								padding: 0.3rem 1.1rem;
								border-radius: 2rem;
							}
						}
					}

					.series {
						display: flex;
						justify-content: center;
						width: 100%;
						padding: 0.7rem 0 0;

						.series-link {
							font-size: 1.1rem;
							text-transform: uppercase;
							margin: 0 0.4rem;
						}
					}
				}
			}
		`,
	],
})
export class HeaderComponent implements OnInit, OnDestroy {
	showMainHeader: boolean = true;
	sidenavOpen: boolean = false;
	blogURL!: string;
	blogInfo!: BlogInfo;
	blogName: string = "";
	// start with default image to prevent 404 when returning from post-details page
	blogImage: string = "/images/anguhashblog-logo-purple-bgr.jpg";
	blogSocialLinks!: BlogLinks;
	seriesList!: SeriesList[];
	// blogService: BlogService = inject(BlogService);
	// iconService: IconService = inject(IconService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private querySubscription?: Subscription;

	ngOnInit(): void {
		// this.blogURL = this.blogService.getBlogURL();
		// this.querySubscription = this.blogService
		// 	.getBlogInfo(this.blogURL)
		// 	.subscribe((data) => {
		// 		this.blogInfo = data;
		// 		this.blogName = this.blogInfo.title;
		// 		this.blogImage =
		// 			this.blogInfo.isTeam && this.blogInfo.favicon
		// 				? (this.blogImage = this.blogInfo.favicon)
		// 				: "/images/anguhashblog-logo-purple-bgr.jpg";
		// 		if (!this.blogInfo.isTeam) {
		// 			this.blogService.getAuthorInfo(this.blogURL).subscribe((data) => {
		// 				this.blogImage = data.profilePicture
		// 					? data.profilePicture
		// 					: "/images/anguhashblog-logo-purple-bgr.jpg";
		// 			});
		// 		}
		// 		const { __typename, ...links } = data.links;
		// 		this.blogSocialLinks = links;
		// 	});
		// this.querySubscription = this.blogService
		// 	.getSeriesList(this.blogURL)
		// 	.subscribe((data) => {
		// 		this.seriesList = data;
		// 	});
		// this.router.events.subscribe((event) => {
		// 	if (event instanceof NavigationEnd) {
		// 		this.showMainHeader =
		// 			!this.route.snapshot.firstChild?.paramMap.has("postSlug");
		// 	}
		// });
	}

	ngOnDestroy(): void {
		this.querySubscription?.unsubscribe();
	}
}

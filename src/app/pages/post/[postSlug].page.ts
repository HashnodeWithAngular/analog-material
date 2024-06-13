import { MediaMatcher } from "@angular/cdk/layout";
import {
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
	inject,
} from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { BlogService } from "../../services/blog.service";
import { BlogInfo, BlogLinks } from "src/app/models/blog-info";
import { Post, SeriesList } from "src/app/models/post";
import { AsyncPipe, DatePipe, KeyValuePipe, ViewportScroller } from "@angular/common";
import { SanitizerHtmlPipe } from "../../pipes/sanitizer-html.pipe";
import { map, Observable, Subscription } from "rxjs";
import { ActivatedRoute, RouterLink } from "@angular/router";

import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { YoutubeVideoEmbedDirective } from "src/app/directives/youtube-video-embed.directive";

@Component({
	selector: "app-post-details",
	standalone: true,
	imports: [
    RouterLink,
		AsyncPipe,
		DatePipe,
    KeyValuePipe,
    SanitizerHtmlPipe,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatSidenavModule,
		MatListModule,
    YoutubeVideoEmbedDirective,
  ],
	template: `
		<div class="post-details-page" [class.is-mobile]="mobileQuery.matches">
  <mat-toolbar class="toolbar">
    <div class="toolbar-row-start">
      <div class="menu">
        <button mat-icon-button (click)="snav.toggle()"><mat-icon>menu</mat-icon></button>
      </div>
      <a routerLink="/" class="blog-title">
        <h1>{{blogName}}</h1>
      </a>
    </div>
    <div class="toolbar-row-end">
    </div>

  </mat-toolbar>

  <mat-sidenav-container class="sidenav-container">
    <mat-sidenav #snav [mode]="mobileQuery.matches ? 'over' : 'side'">
      <div class="mat-sidenav-menu">
        <h3>Series</h3>
        <mat-nav-list class="series">
          @for (series of seriesList; track series) {
          <a [routerLink]="['/series', series.slug]">{{series.name}}</a>
          }
        </mat-nav-list>
        <mat-nav-list class="social">
          <!-- issues with icons path after adding public folder -->
          <!-- <app-blog-social-icons [blogSocialLinks]="blogSocialLinks"></app-blog-social-icons> -->
        </mat-nav-list>
      </div>
    </mat-sidenav>

    <mat-sidenav-content>
      @if (post$ | async; as post) {
      <article>
        <h1 class="title">{{ post.title }}</h1>
        <img class="cover-image" [src]="post.coverImage.url" alt="Cover image for {{ post.title }}">
        <div class="post-details">
          <div class="author-info">
            <img class="author-image" [src]="post.author.profilePicture" alt="{{post.author.username}}">
            <div class="author-text">
              <span class="author-name">{{post.author.username}}</span>
              <div class="post-meta">
                <span class="published-date">
                  <mat-icon>today</mat-icon>
                  {{post.publishedAt | date: 'MMM dd, yyyy' }}
                </span>
                <span class="read-time">
                  <mat-icon>import_contacts</mat-icon>
                  {{post.readTimeInMinutes}} min read
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- yt video directive not set since there were errors with bath also -->
        <div class="content" [innerHTML]="post.content.html | sanitizerHtml" youtubeVideoEmbed></div>
      </article>
      }
    </mat-sidenav-content>
  </mat-sidenav-container>

  <mat-toolbar class="footer">
    <p>&copy; {{date}} {{blogName}}</p>
    <small>Created using<a href="https://github.com/AnguHashBlog" target="_blank">AnguHashBlog</a></small>
  </mat-toolbar>
</div>

	`,
	styles: [
		`
			.post-details-page {
				display: flex;
				flex-direction: column;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;

				.is-mobile {
					.sidenav-container {
						flex: 1 0 auto;
					}

					.toolbar {
						position: fixed;
						z-index: 2;
					}
				}

				.toolbar {
					position: relative;
					display: flex;
					justify-content: space-between;
					z-index: 6;

					.toolbar-row-start {
						display: flex;
            align-items: center;
					}

					.toolbar-row-end {
						.theme-control {
							display: flex;
							align-items: center;
						}
					}
				}

				mat-sidenav-container {
					overflow: visible;

					mat-sidenav {
						position: fixed;
						display: flex;
						flex-direction: column;
						max-width: 13rem;
						padding: 1rem;
						z-index: 5;

						.mat-sidenav-menu {
							margin-top: 2.9rem;

							h3 {
								font-size: 1.1rem;
								font-weight: 400;
								text-transform: uppercase;
								margin: 0;
							}

							mat-nav-list {
								display: flex;
								font-size: 1rem;

								&.series {
									flex-direction: column;
								}
							}
						}
					}

					mat-sidenav-content {
						display: flex;
						flex-direction: column;
						align-items: center;

						article {
							max-width: 50vw;
							margin: 1.25rem 0;
							padding: 1.25rem;
							border-radius: 0.3rem;

							.title {
								font-size: 1.7rem;
								font-weight: 500;
								margin-bottom: 0.625rem;
							}

							.cover-image {
								max-width: 100%;
								height: auto;
								margin-bottom: 0.5rem;
								border-radius: 0.3125rem;
							}

							.post-details {
								border-radius: 1.25rem;
								display: flex;
								align-items: center;

								.author-info {
									display: flex;
									align-items: center;
									margin: 1rem 0;

									.author-image {
										border-radius: 50%;
										width: 3.125rem;
									}

									.author-text {
										display: flex;
										flex-direction: column;
										margin-left: 0.625rem;

										.author-name {
											font-size: 1.1rem;
											font-weight: 500;
										}

										.post-meta {
											display: flex;
											align-items: center;
											margin: 0.4rem 0;

											mat-icon {
												font-size: 1rem;
												height: 1.1rem;
												width: 1.1rem;
											}

											.published-date,
											.read-time {
												display: flex;
												align-items: center;
												justify-content: center;
												font-size: 0.8rem;
												padding: 0.1rem 0.4rem;
												border-radius: 0.4rem;
												margin-right: 0.4rem;
											}
										}
									}
								}
							}

							.content {
								font-size: 1rem;
								line-height: 1.5rem;

								iframe {
									width: 100%;
									height: calc(50vw * 0.5625);
								}
							}
						}
					}
				}

				.footer {
					position: relative;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: space-between;
					height: 6rem;
					padding: 1rem;
					z-index: 6;

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
				}
			}

			@media (max-width: 600px) {
				.post-details-page {
					mat-sidenav-container {
						mat-sidenav-content {
							article {
								max-width: 80vw;

								.title {
									font-size: 1.4rem;
								}

								.content {
									line-height: 2rem;

									iframe {
										height: calc(50vw * 0.9);
									}
								}
							}
						}
					}
				}
			}
		`,
	],
})
export default class PostDetailsComponent implements OnInit, OnDestroy {
  private readonly scroller = inject(ViewportScroller);
	mobileQuery: MediaQueryList;
  date = new Date().getFullYear();
  blogURL!: string;
	blogInfo!: BlogInfo;
	blogName: string = "";
	blogSocialLinks!: BlogLinks;
	seriesList!: SeriesList[];
	post$!: Observable<Post>;
  postTitle!: string;
	postCoverImage!: string;
  private route = inject(ActivatedRoute);
	private blogService = inject(BlogService);
  private meta = inject(Meta);
	private querySubscription?: Subscription;
	private _mobileQueryListener: () => void;

	postSlug$ = this.route.paramMap.pipe(map((params) => params.get("postSlug")));

	constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
		this.mobileQuery = media.matchMedia("(max-width: 600px)");
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	ngOnInit(): void {
		this.scroller.scrollToPosition([0, 0]);
    this.blogURL = this.blogService.getBlogURL();
		this.querySubscription = this.blogService
			.getBlogInfo(this.blogURL)
			.subscribe((data) => {
				this.blogInfo = data;
				this.blogName = this.blogInfo.title;
        const { __typename, ...links } = data.links;
        this.blogSocialLinks = links;
			});
      this.postSlug$.subscribe((slug) => {
        if (slug !== null) {
          this.post$ = this.blogService.getSinglePost(this.blogURL, slug);
          this.post$.subscribe((post) => {
            this.postTitle = post.title;
            this.postCoverImage = post.coverImage.url;
            this.meta.updateTag({
              name: "title",
              content: post.title,
            });
            this.meta.updateTag({
              name: "description",
              content: post.title,
            });
            this.meta.updateTag({
              name: "image",
              content: this.postCoverImage,
            });
          });
        }
      });
	}

	ngOnDestroy(): void {
		this.querySubscription?.unsubscribe();
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}
}

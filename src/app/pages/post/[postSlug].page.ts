import { Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, Subscription } from "rxjs";
import { BlogService } from "../../services/blog.service";
import { BlogInfo } from "src/app/models/blog-info";
import { Post } from "src/app/models/post";
import { AsyncPipe, DatePipe } from "@angular/common";
import { SanitizerHtmlPipe } from "../../pipes/sanitizer-html.pipe";

@Component({
	selector: "app-post-details",
	standalone: true,
	imports: [AsyncPipe, DatePipe, SanitizerHtmlPipe],
	template: `
		<div class="post-details-page">
			<div class="content">
				@if (post$ | async; as post) {
				<article>
					<h1 class="title">{{ post.title }}</h1>
					<img
						class="cover-image"
						[src]="post.coverImage.url"
						alt="Cover image for {{ post.title }}"
					/>
					<div class="post-details">
						<div class="author-info">
							<img
								class="author-image"
								[src]="post.author.profilePicture"
								alt="{{ post.author.username }}"
							/>
							<div class="author-text">
								<span class="author-name">{{ post.author.username }}</span>
								<div class="post-meta">
									<span class="published-date">
										<span class="material-symbols-outlined"> today </span>
										{{ post.publishedAt | date : "MMM dd, yyyy" }}
									</span>
									<span class="read-time">
										<span class="material-symbols-outlined">
											import_contacts
										</span>
										{{ post.readTimeInMinutes }} min read
									</span>
								</div>
							</div>
						</div>
					</div>
					<div
						class="content"
						[innerHTML]="post.content.html | sanitizerHtml"
						clipboardCopyButton
						youtubeVideoEmbed
					></div>
				</article>
				}
			</div>
		</div>
	`,
	styles: [
		`
			.post-details-page {
				article {
					margin: 0 auto;
					max-width: 50vw;
					padding: 1.25rem;
					border-radius: 0.3rem;

					.title {
						font-size: 1.7rem;
						font-weight: 500;
					}

					.cover-image {
						max-width: 100%;
						height: auto;
						margin-bottom: 0.5rem;
						border-radius: 0.3rem;
					}

					.post-details {
						border-radius: 1.25rem;
						display: flex;
						align-items: center;

						.author-info {
							display: flex;
							align-items: center;

							.author-image {
								border-radius: 50%;
								width: 3rem;
							}

							.author-text {
								display: flex;
								flex-direction: column;
								margin-left: 0.6rem;

								.author-name {
									font-size: 1.1rem;
									font-weight: 500;
								}

								.post-meta {
									display: flex;
									align-items: center;
									margin: 0.4rem 0;

									.material-symbols-outlined {
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
										padding: 0.2rem 0.5rem;
										border-radius: 0.4rem;
										margin-right: 0.4rem;
									}
								}
							}
						}
					}

					.content {
						display: flex;
						flex-direction: column;
						font-size: 1rem;
						line-height: 1.5rem;

						p {
							img {
								display: block;
								width: 100%;
								margin: 0 auto;
							}
						}

						.copy-button {
							position: absolute;
							top: 1%;
							right: 1%;
						}

						iframe {
							width: 100%;
							height: calc(50vw * 0.5625);
						}
					}
				}
			}
		`,
	],
})
export default class PostDetailsComponent implements OnInit, OnDestroy {
	blogURL!: string;
	blogInfo!: BlogInfo;
	blogName: string = "";
	post$!: Observable<Post>;
	postTitle!: string;
	postCoverImage!: string;
	private route = inject(ActivatedRoute);
	private blogService = inject(BlogService);
	private meta: Meta = inject(Meta);
	private querySubscription?: Subscription;

	postSlug$ = this.route.paramMap.pipe(map((params) => params.get("postSlug")));

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		this.querySubscription = this.blogService
			.getBlogInfo(this.blogURL)
			.subscribe((data) => {
				this.blogInfo = data;
				this.blogName = this.blogInfo.title;
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
		this.meta.updateTag({
			name: "description",
			content: "Analog Template for Hashnode Blogs",
		});
		this.meta.updateTag({
			name: "image",
			content: "/assets/angular-anguhashblog-dark.jpg",
		});
	}
}

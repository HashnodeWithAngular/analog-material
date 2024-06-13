import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AsyncPipe, SlicePipe } from "@angular/common";
import { Post } from "../models/post";
import { BlogService } from "../services/blog.service";
import { Observable } from "rxjs";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterLink, AsyncPipe, SlicePipe],
	template: `
		<div class="posts-view">
			<div class="cards-wrapper grid">
				@for (post of posts$ | async; track post) {
				<a [routerLink]="['post', post.slug]" class="card">
					<div class="card-image">
						<img [src]="post.coverImage.url" />
					</div>
					<div class="card-title">
						<h3>
							{{
								post.title.length > 90
									? (post.title | slice : 0 : 90) + "..."
									: post.title
							}}
						</h3>
					</div>
				</a>
				}
			</div>
		</div>
	`,
	styles: [
		`
			.posts-view {
				width: 80vw;
				min-height: 67.2vh;
				padding: 0.5rem 0;
				margin: 0 auto 2rem;

				.layout-control {
					display: flex;
					justify-content: flex-end;
				}

				.cards-wrapper {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					margin: 2rem 1rem 1rem;

					&.grid {
						.card {
							&:hover {
								transform: scale(1.1);
								transition: all 0.3s ease-in-out;
							}
						}
					}
				}

				.load-more-posts {
					display: flex;
					justify-content: center;
					button {
						font-size: 1rem;
						text-transform: uppercase;
					}
				}
			}
		`,
	],
})
export default class HomeComponent implements OnInit {
	blogURL!: string;
	posts$!: Observable<Post[]>;
	private blogService = inject(BlogService);

	ngOnInit() {
		this.blogURL = this.blogService.getBlogURL();
		this.posts$ = this.blogService.getPosts(this.blogURL);
	}
}

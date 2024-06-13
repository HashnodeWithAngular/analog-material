import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { AsyncPipe, SlicePipe } from "@angular/common";
import { Observable, switchMap } from "rxjs";
import { Post } from "src/app/models/post";
import { BlogService } from "../../services/blog.service";

@Component({
	selector: "app-series",
	standalone: true,
	imports: [RouterLink, AsyncPipe, SlicePipe],
	template: `
		<div class="series-view">
			<div class="cards-wrapper grid">
				@for (post of postsInSeries$ | async; track post) {
				<a [routerLink]="['/post', post.slug]" class="card">
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
        .series-view {
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
export default class SeriesComponent implements OnInit {
	blogURL!: string;
	slug: string = "";
	postsInSeries$!: Observable<Post[]>;
	blogService: BlogService = inject(BlogService);
	route: ActivatedRoute = inject(ActivatedRoute);

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		this.postsInSeries$ = this.route.params.pipe(
			switchMap((params: Params) => {
				this.slug = params["slug"];
				return this.blogService.getPostsInSeries(this.blogURL, this.slug);
			})
		);
	}
}

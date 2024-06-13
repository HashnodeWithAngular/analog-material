import { Component, inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogModule,
} from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Post } from "../models/post";
import { BlogService } from "../services/blog.service";

@Component({
	selector: "app-search-dialog",
	standalone: true,
	imports: [
		MatDialogModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		DatePipe,
	],
	template: `<div class="search-dialog-header">
			<h2>Search posts</h2>
			<mat-icon class="close-button" mat-dialog-close>close</mat-icon>
		</div>

		<mat-dialog-content>
			<mat-form-field class="search-field">
				<input matInput type="text" [formControl]="queryFormControl" />
				@if (queryFormControl.value) {
				<mat-icon matSuffix (click)="clearQuery()">close</mat-icon>
				}
			</mat-form-field>

			@if (queryFormControl.value && posts.length !== 0) { @for (post of posts;
			track post.id) {
			<div class="search-result" (click)="navigateToPost(post.slug)">
				<div class="info-section">
					<h2 class="post-title">{{ post.title }}</h2>
					<p class="author-name post-info">{{ post.author.name }}</p>
					<p class="post-info">{{ post.publishedAt | date }}</p>
				</div>
				<img [src]="post.coverImage.url" [alt]="post.title + ' cover image'" />
			</div>
			} } @else { @if (queryFormControl.value) {
			<div class="no-result-text">
				<mat-icon class="">search</mat-icon>
				<p>No matching articles found. Try another search</p>
			</div>
			} @else {
			<div class="no-result-text">
				<mat-icon class="">search</mat-icon>
				<p>Search articles from this blog</p>
			</div>
			} }
		</mat-dialog-content> `,
	styles: `.search-dialog-header {
    display: flex;
    align-items: center;
    padding: 24px 20px 0;

    h2 {
      margin-bottom: 0;
    }

    .close-button {
      margin-left: auto;
      cursor: pointer;
    }
  }

  mat-dialog-content {
    .search-field {
      width: 100%;

      mat-icon {
        cursor: pointer;
      }
    }

    .search-result {
      display: flex;
      margin-bottom: 0.6rem;
      align-items: center;
      padding: 0.6rem;
      border-radius: 0.3rem;

      &:hover {
        // applied here since in theme.scss in light mode it had no effect
        background-color: #989898;
        cursor: pointer;
      }

      .post-title {
        line-height: 2rem;
        font-weight: 500;
        margin-bottom: 0;
      }

      .author-name {
        font-size: small;
        margin-top: 0;
      }

      .post-info {
        font-size: 0.9rem;
      }

      img {
        height: 7rem;
        margin-left: auto;
        border-radius: 0.3rem;
      }
    }
  }

  .no-result-text {
    display: flex;
    justify-content: center;
    align-items: center;

    mat-icon {
      margin-right: 0.4rem;
    }
  }

  @media (max-width: 600px) {
    .search-result {
      flex-direction: column;
      padding: 0.6rem 0;

      .info-section {
        .post-title {
          font-weight: 500;
          font-size: 1.1rem;
          line-height: 1.4rem;
        }
        .author-name{
          margin: 0.5rem 0 0;
        }
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  `,
})
export class SearchDialogComponent {
	blogId: string = inject(MAT_DIALOG_DATA);
	blogService = inject(BlogService);
	router = inject(Router);
	dialog = inject(MatDialog);

	posts: Post[] = [];
	queryFormControl = new FormControl("");

	ngOnInit() {
		this.queryFormControl.valueChanges.subscribe((query) =>
			this.searchPosts(query)
		);
	}

	searchPosts(query: string | null) {
		this.blogService.searchPosts(this.blogId, query).subscribe((response) => {
			this.posts = response;
		});
	}

	navigateToPost(slug: string) {
		this.dialog.getDialogById("searchDialog")!.close();
		this.router.navigate(["/post", slug]);
	}

	clearQuery() {
		this.queryFormControl.reset();
	}
}

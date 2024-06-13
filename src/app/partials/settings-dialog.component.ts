import { Component, OnInit, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BlogService } from "../services/blog.service";

@Component({
	selector: "app-settings-dialog",
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
	],
	template: `<div class="dialog-close">
			<mat-icon mat-dialog-close>close</mat-icon>
		</div>

		@if (blogURLChanged) {
		<mat-dialog-content>
			<p>Blog URL changed and set in local storage</p>
			<p>Reload the page to see your content loading</p>
			<p>When resetting you may need to click on</p>
			<p>the logo image to load the content again</p>
			<div class="dialog-actions">
				<button mat-raised-button (click)="resetBlogURL()">Reset</button>
			</div>
		</mat-dialog-content>
		} @else {
		<mat-dialog-content>
			<h3 mat-dialog-title>Try with your Blog</h3>
			<p>try AnguHashBlog</p>
			<small>with another Hashnode blog </small>
			<mat-form-field>
				<mat-label>Blog URL</mat-label>
				<input matInput type="text" [(ngModel)]="newBlogURL" />
				@if (newBlogURL) {
				<button
					matSuffix
					mat-icon-button
					aria-label="Clear"
					(click)="newBlogURL = ''"
				>
					<mat-icon>close</mat-icon>
				</button>
				}
			</mat-form-field>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="dialog-actions">
				<button mat-raised-button (click)="changeBlogURL(); newBlogURL = ''">
					Change
				</button>
			</div>
		</mat-dialog-actions>
		} `,
	styles: `:host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80%;
    padding: 0.7rem;

    h3 {
      font-size: 1.3rem;
      font-weight: 400;
      margin: 0;
    }

    .dialog-close {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;

      mat-icon {
        cursor: pointer;
      }
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: 100%;
      text-align: center;
      padding: 0 2rem;

      p {
        font-size: 0.9rem;
        line-height: 1.5rem;
        margin: 0;
      }

      mat-form-field {
        margin: 1rem 0 0;

        input {
          width: 100%;
        }
      }
    }

    mat-dialog-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 2rem;

      p {
        font-size: 0.8rem;
        text-align: center;
      }

      button {
        font-size: 1rem;
        text-transform: uppercase;
      }
    }
  }

  @media (max-width: 600px) {
    :host {
      h3 {
        font-size: 1.1rem;
        padding: 0;
        margin: 0;

        &::before {
          display: none;
        }
      }
    }
  }
  `,
})
export class SettingsDialogComponent implements OnInit {
	blogURL: string = "hashnode.anguhashblog.com";
	newBlogURL: string = "";
	blogURLChanged: boolean = false;
	blogService: BlogService = inject(BlogService);

	constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>) {}

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		if (this.blogURL === "hashnode.anguhashblog.com") {
			this.blogURLChanged = false;
		} else {
			this.blogURLChanged = true;
		}
	}

	changeBlogURL(): void {
		this.blogService.setBlogURL(this.newBlogURL);
		this.blogURL = this.blogService.getBlogURL();
		if (this.blogURL === "hashnode.anguhashblog.com") {
			this.blogURLChanged = false;
		} else {
			this.blogURLChanged = true;
			this.dialogRef.close();
			window.location.reload();
		}
	}

	resetBlogURL(): void {
		this.blogService.resetBlogURL();
		this.blogURL = this.blogService.getBlogURL();
		this.blogURLChanged = false;
		this.dialogRef.close();
		window.location.reload();
	}
}

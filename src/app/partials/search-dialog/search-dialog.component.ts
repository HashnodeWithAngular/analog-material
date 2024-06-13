import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Post } from "../../models/post";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BlogService } from "../../services/blog.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent {
  blogId: string = inject(MAT_DIALOG_DATA);
  blogService = inject(BlogService);
  router = inject(Router);
  dialog = inject(MatDialog);

  posts: Post[] = [];
  queryFormControl = new FormControl('');

  ngOnInit() {
    this.queryFormControl.valueChanges.subscribe(query => this.searchPosts(query));
  }

  searchPosts(query: string | null) {
    this.blogService.searchPosts(this.blogId, query)
      .subscribe(response => {
        this.posts = response;
      });
  }

  navigateToPost(slug: string) {
    this.dialog.getDialogById('searchDialog')!.close();
    this.router.navigate(['/post', slug]);
  }

  clearQuery() {
    this.queryFormControl.reset();
  }
}

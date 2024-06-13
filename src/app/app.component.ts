import { Component, Inject, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header.component";
import { FooterComponent } from "./components/footer.component";
import { Subscription } from "rxjs";
import { BlogInfo } from "./models/blog-info";
import { BlogService } from "./services/blog.service";
import { DOCUMENT } from "@angular/common";


@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	template: `
		<app-header />
		<router-outlet />
		<app-footer />
	`,
	styles: [
		`
			:host {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-height: 100vh;
				width: 100vw;
				overflow-x: hidden;
			}
		`,
	],
})
export class AppComponent {
  title = "angular-material-app";
	blogURL!: string;
	blogInfo!: BlogInfo;
	siteFavicon: any;
	blogService: BlogService = inject(BlogService);
	private querySubscription?: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document) {}

	ngOnInit(): void {
		this.blogURL = this.blogService.getBlogURL();
		this.siteFavicon = this.document.querySelector(
			'link[rel="icon"]'
		) as HTMLLinkElement;
		this.querySubscription = this.blogService
			.getBlogInfo(this.blogURL)
			.subscribe((data) => {
				this.blogInfo = data;
				if (this.blogInfo.isTeam && this.blogInfo.favicon) {
					this.siteFavicon.href = this.blogInfo.favicon;
				} else {
					this.siteFavicon.href = "favicon.ico";
				}
				if (!this.blogInfo.isTeam) {
					this.blogService.getAuthorInfo(this.blogURL).subscribe((data) => {
						if (data.profilePicture) {
							this.siteFavicon.href = data.profilePicture;
						} else {
							this.siteFavicon.href = "favicon.ico";
						}
					});
				}
			});
	}
	ngOnDestroy(): void {
		this.querySubscription?.unsubscribe();
	}
}

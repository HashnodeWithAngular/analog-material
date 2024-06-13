import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BlogLinks } from "../../models/blog-info";
import { KeyValuePipe } from "@angular/common";

import { MatIcon, MatIconRegistry } from "@angular/material/icon";

@Component({
	selector: "app-blog-social-icons",
	standalone: true,
	imports: [KeyValuePipe, MatIcon],
	templateUrl: "./blog-social-icons.component.html",
	styleUrl: "./blog-social-icons.component.scss",
})
export class BlogSocialIconsComponent {

  @Input() blogSocialLinks!: BlogLinks;

  constructor (private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer)
  { iconRegistry.addSvgIcon('twitter', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/twitter.svg'));
  this.iconRegistry.addSvgIcon('instagram', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/instagram.svg'));
  this.iconRegistry.addSvgIcon('github', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/github.svg'));
  this.iconRegistry.addSvgIcon('website', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/website.svg'));
  this.iconRegistry.addSvgIcon('hashnode', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/hashnode.svg'));
  this.iconRegistry.addSvgIcon('youtube', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/youtube.svg'));
  this.iconRegistry.addSvgIcon('dailydev', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/dailydev.svg'));
  this.iconRegistry.addSvgIcon('linkedin', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/linkedin.svg'));
  this.iconRegistry.addSvgIcon('mastodon', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mastodon.svg'));
  }
}

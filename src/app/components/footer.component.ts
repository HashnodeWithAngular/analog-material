import { Component } from "@angular/core";

@Component({
	selector: "app-footer",
	standalone: true,
	imports: [],
	template: `
		<footer>
			<p>&copy; {{ date }} {{ blogName }}</p>
			<small>Created using<a href="https://anguhashblog.com" target="_blank">AnguHashBlog</a> and<a href="https://analogjs.org/" target="_blank">Analog</a></small>
		</footer>
	`,
	styles: [
		`
			footer {
        background-color: #252525;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: space-between;
				position: relative;
				padding: 2rem 1rem;
				z-index: 2;
			}

			p,
			small {
				text-align: center;
				width: 100%;
				margin: 0;
			}

			small {
				color: #999999;
				margin-top: 0.8rem;
			}

			small a {
				margin-left: 0.4rem;
			}
		`,
	],
})
export class FooterComponent {
	blogName = "AnguHashBlog";
	date = new Date().getFullYear();
}

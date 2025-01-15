import { Component, inject } from "@angular/core";
import {
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-follow-dialog",
	standalone: true,
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatButtonModule,
		MatIconModule,
	],
	template: `<div class="dialog-close">
			<mat-icon mat-dialog-close>close</mat-icon>
		</div>
		<img
			class="logo"
			src="/images/hashnode-withangular-logo-purple-bgr.jpg"
			alt=""
		/>
		<mat-dialog-content>
			<h3>Hey, 👋 sign up or sign in to interact.</h3>
		</mat-dialog-content>
		<mat-dialog-actions>
			<a
				class="button"
				href="https://hashnode.com/"
				target="_blank"
				rel="noopener noreferrer"
				><img src="/images/hashnode-logo-white.png" alt="Sign in" />Sign
				in with Hashnode</a
			>
			<p>
				This blog is powered by
				<a
					class="link"
					href="https://hashnode.com/"
					target="_blank"
					rel="noopener noreferrer"
					>Hashnode</a
				>. To interact with the content on this blog, please log in through
				Hashnode.
			</p>
		</mat-dialog-actions> `,
	styles: `:host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;

    .dialog-close {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;

      mat-icon {
        cursor: pointer;
      }
    }

    .logo {
      width: 5rem;
      height: 5rem;
      margin: 1rem;
      border-radius: 50%;
    }

    mat-dialog-content {
      h3 {
        font-size: 1.1rem;
        font-weight: 400;
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

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #2563eb;
        color: #fff;
        font-size: 1.1rem;
        padding: 0.7rem 3rem;
        margin: 1rem 0;
        border: none;
        border-radius: 3rem;

        img {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
        }
      }

      .link {
        color: #2563eb;
        font-size: 0.8.5rem;
        margin: 0;
      }
    }
  }

  @media (max-width: 600px) {
    :host {
      .logo {
        width: 3rem;
        height: 3rem;
        margin: 0 0 0.3rem;
        border-radius: 50%;
      }

      mat-dialog-content {
        padding: 0;
        margin: 0;
        h3 {
          font-size: 1.1rem;
          text-align: center;
        }
      }

      mat-dialog-actions {
        padding: 0;

        .button {
          font-size: 1rem;
          padding: 0.5rem 0.7rem;;

          img {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.5rem;
          }
        }
      }
    }
  }
  `,
})
export class FollowDialogComponent {}

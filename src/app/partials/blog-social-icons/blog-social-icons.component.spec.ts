import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSocialIconsComponent } from './blog-social-icons.component';

describe('BlogSocialIconsComponent', () => {
  let component: BlogSocialIconsComponent;
  let fixture: ComponentFixture<BlogSocialIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSocialIconsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogSocialIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

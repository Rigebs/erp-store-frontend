import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-setup-card',
  imports: [],
  templateUrl: './setup-card.html',
  styleUrl: './setup-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupCard {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  stats = input.required<string>();
  link = input.required<string>();

  manage = output<string>();

  onManage(event: Event): void {
    event.preventDefault();
    this.manage.emit(this.link());
  }
}

import {
  Injectable,
  ComponentRef,
  Type,
  EnvironmentInjector,
  createComponent,
  ApplicationRef,
  inject,
  RendererFactory2,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private rendererFactory = inject(RendererFactory2);

  private renderer = this.rendererFactory.createRenderer(null, null);

  private modalRef: ComponentRef<any> | null = null;
  private resultSubject = new Subject<any>();

  open<T>(component: Type<T>, inputs: Partial<Record<keyof T, any>> = {}): Observable<any> {
    if (this.modalRef) this.close();

    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'padding-right', '15px');

    this.modalRef = createComponent(component, {
      environmentInjector: this.injector,
    });

    Object.keys(inputs).forEach((key) => {
      if (this.modalRef) {
        this.modalRef.setInput(key, (inputs as any)[key]);
      }
    });

    this.appRef.attachView(this.modalRef.hostView);

    const domElem = (this.modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.resultSubject = new Subject<any>();
    return this.resultSubject.asObservable();
  }

  close(result?: any) {
    if (!this.modalRef) return;

    this.resultSubject.next(result);
    this.resultSubject.complete();

    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'padding-right');

    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
    this.modalRef = null;
  }
}

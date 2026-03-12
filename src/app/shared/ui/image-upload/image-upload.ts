import { Component, ChangeDetectionStrategy, signal, computed, output, input } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.drag-over]': 'isDragOver()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
  },
})
export class ImageUpload {
  imageUrl = input<string | null>(null);
  upload = output<File>();
  remove = output<void>();
  isLoading = input<boolean>(false); // <--- Nuevo input

  isDragOver = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

  displayImage = computed(() => this.imageUrl() || this.previewUrl());

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  confirmUpload() {
    const file = this.selectedFile();
    if (file && !this.isLoading()) {
      this.upload.emit(file);
      this.selectedFile.set(null);
    }
  }

  clearSelection() {
    if (this.isLoading()) return;
    this.previewUrl.set(null);
    this.selectedFile.set(null);
    this.remove.emit();
  }
}

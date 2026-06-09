import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ResourcesService } from '../../services/resources.service';
import { CommunityResource } from '../../models/resources-response.model';

type Tab = 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-resources-management',
  imports: [DatePipe, FormsModule],
  templateUrl: './resources-management.html',
  styleUrl: './resources-management.css',
})
export class ResourcesManagement implements OnInit {
  private resourcesService = inject(ResourcesService);
  private toastService = inject(ToastService);

  activeTab: Tab = 'pending';
  sortOrder: 'asc' | 'desc' = 'desc';
  searchQuery = '';

  pendingResources: CommunityResource[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  isLoading = false;
  isToggling = new Set<number>();

  ngOnInit() {
    this.loadPending();
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'pending') {
      this.currentPage = 1;
      this.loadPending();
    }
  }

  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.currentPage = 1;
    this.loadPending();
  }

  private loadPending() {
    this.isLoading = true;
    this.resourcesService
      .getPendingCommunity(this.currentPage, this.pageSize, this.sortOrder)
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.pendingResources = res.data.resources.items;
            this.totalPages = res.data.resources.totalPages;
          } else {
            this.toastService.error(res.message || 'Error al cargar recursos.');
          }
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Error al cargar recursos pendientes.');
          this.isLoading = false;
        },
      });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPending();
  }

  approve(resource: CommunityResource) {
    this.isToggling.add(resource.id);
    this.resourcesService.approveResource(resource.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.pendingResources = this.pendingResources.filter(
            (r) => r.id !== resource.id
          );
          this.toastService.success('Recurso aprobado correctamente.');
        } else {
          this.toastService.error(res.message || 'Error al aprobar recurso.');
        }
        this.isToggling.delete(resource.id);
      },
      error: () => {
        this.toastService.error('Error al aprobar recurso.');
        this.isToggling.delete(resource.id);
      },
    });
  }

  reject(resource: CommunityResource) {
    this.isToggling.add(resource.id);
    this.resourcesService.rejectResource(resource.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.pendingResources = this.pendingResources.filter(
            (r) => r.id !== resource.id
          );
          this.toastService.success('Recurso descartado correctamente.');
        } else {
          this.toastService.error(res.message || 'Error al descartar recurso.');
        }
        this.isToggling.delete(resource.id);
      },
      error: () => {
        this.toastService.error('Error al descartar recurso.');
        this.isToggling.delete(resource.id);
      },
    });
  }

  get filteredResources() {
    if (!this.searchQuery.trim()) return this.pendingResources;
    const q = this.searchQuery.toLowerCase();
    return this.pendingResources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.userFirstName.toLowerCase().includes(q) ||
        r.userLastName.toLowerCase().includes(q) ||
        r.userCode.toLowerCase().includes(q)
    );
  }
}

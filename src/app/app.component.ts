import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { MicroCoreService } from '../../packages/micro-core/src/public_api';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalEventDispatcher } from '../../packages/micro-core/src/lib/global-event-dispatcher';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ngx-micro-frontend';

    constructor(
        private micro: MicroCoreService,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationRef: ApplicationRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.micro.registerApplication('app1', {
            routerPathPrefix: '/app1',
            selector: 'app1-root',
            // prettier-ignore
            scripts: [
                // 'app1/assets/runtime.js',
                // 'app1/assets/polyfills.js',
                'app1/assets/main.js'
            ]
        });
        this.micro.registerApplication('app2', {
            routerPathPrefix: '/app2',
            selector: 'app2-root',
            // prettier-ignore
            scripts: [
                'app2/assets/main.js'
            ]
        });

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.micro.resetRouting(event);
                // this.micro.registerApplication();
                // that.mooa.reRouter(event);
            }
        });

        // (window as any).globalEventDispatcher = this.globalEventDispatcher;
        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            this.ngZone.run(() => {
                this.thyDialog.open(ADetailComponent);
                // this.applicationRef.tick();
            });
        });
    }
}
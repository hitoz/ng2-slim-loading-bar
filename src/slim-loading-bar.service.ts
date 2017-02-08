// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-slim-loading-bar

import {Injectable, EventEmitter} from '@angular/core';

import {isPresent} from './slim-loading-bar.utils';

export enum SlimLoadingBarEventType {
    PROGRESS,
    HEIGHT,
    COLOR,
    VISIBLE
}

export class SlimLoadingBarEvent {
    constructor(public type:SlimLoadingBarEventType, public value:any) {}
}

export function slimLoadingBarServiceFactory(): SlimLoadingBarService  {
    return new SlimLoadingBarService(new EventEmitter<SlimLoadingBarEvent>());
 }

/**
 * SlimLoadingBar service helps manage Slim Loading bar on the top of screen or parent component
 */
@Injectable()
export class SlimLoadingBarService {

    private _progress:number = 0;
    private _height:string = '2px';
    private _color:string = 'firebrick';
    private _visible:boolean = true;

    private _intervalCounterId:any = 0;
    public interval:number = 500; // in milliseconds

    constructor(public events: EventEmitter<SlimLoadingBarEvent>) {}

    set progress(value:number) {
        if (isPresent(value)) {
            if (value > 0) {
                this.visible = true;
            }
            this._progress = value;
            this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.PROGRESS, this._progress));
        }
    }

    get progress():number {
        return this._progress;
    }


    set height(value:string) {
        if (isPresent(value)) {
            this._height = value;
            this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.HEIGHT, this._height));
        }
    }

    get height():string {
        return this._height;
    }

    set color(value:string) {
        if (isPresent(value)) {
            this._color = value;
            this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.COLOR, this._color));
        }
    }

    get color():string {
        return this._color;
    }

    set visible(value: boolean) {
        if (isPresent(value)) {
            this._visible = value;
            this.emitEvent(new SlimLoadingBarEvent(SlimLoadingBarEventType.VISIBLE, this._visible));
        }
    }

    get visible():boolean {
        return this._visible;
    }

    private emitEvent(event: SlimLoadingBarEvent) {
        if (this.events) {
            // Push up a new event
            this.events.next(event);
        }
    }


    start(onCompleted:Function = null) {
        // Stop current timer
        this.stop();
        // Make it visible for sure
        this.visible = true;
        // Run the timer with milliseconds iterval
        this._intervalCounterId = setInterval(() => {
            // Increment the progress and update view component
            this.progress++;
            // If the progress is 100% - call complete
            if (this.progress === 100) {
                this.complete();
            }
        }, this.interval);
    }

    startIncrease(onCompleted:Function = null) {
        // Stop current timer
        this.stop();
        // Make it visible for sure
        this.visible = true;
        // Run the timer with milliseconds iterval
        this._intervalCounterId = setInterval(() => {
            if (this.progress >= 100) {
                return;
            }

            let increment = 0;

            if (this.progress >= 0 && this.progress < 25) {
                increment = (Math.random() * (5 - 3 + 1) + 3) / 100;
            }
            else if (this.progress >= 25 && this.progress < 65) {
                increment = (Math.random() * 3) / 100;
            }
            else if (this.progress >= 65 && this.progress < 90) {
                increment = (Math.random() * 2) / 100;
            }
            else if (this.progress >= 90 && this.progress < 99) {
                increment = 0.5;
            }
            else {
                if (onCompleted !== null) {
                    this.progress = 100;
                }
            }

            this.progress += increment;

            if (this.progress === 100) {
                this.complete();
            }
        }, this.interval);
    }

    stop() {
        if (this._intervalCounterId) {
            clearInterval(this._intervalCounterId);
            this._intervalCounterId = null;
        }
    }

    reset() {
        this.stop();
        this.progress = 0;
    }

    complete() {
        this.progress = 100;
        this.stop();
        setTimeout(() => {
            // Hide it away
            this.visible = false;
            setTimeout(() => {
                // Drop to 0
                this.progress = 0;
            }, 250);
        }, 250);
    }


}


import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Item } from './item';
import { Vector3 } from 'three/src/math/Vector3';
import { MousePointer } from '../core/mousePointer';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Item> = [];

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    for(let i = 0; i < 51; i++) {
      const item = new Item({
        id:i,
      })
      if(i == 0) {
        this._con.add(item);
      } else {
        this._item[i - 1].add(item);
      }

      this._item.push(item);
    }

    this._resize()
  }


  protected _update(): void {
    super._update()

    this._con.position.y = Func.instance.screenOffsetY() * -1;

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    const mkake = 0.01;
    const mx = MousePointer.instance.easeNormal.x * w * mkake;
    const my = MousePointer.instance.easeNormal.y * h * mkake * -1;

    let baseRadius = Math.min(w, h) * 0.5;
    let moveRadius = 0;
    let center = new Vector3(mx, my, 0);
    let kake = 0.95;

    this._item.forEach((val,i) => {
      val.updateItem({
        radius:baseRadius,
        moveRadius:i == 0 ? 0 : moveRadius,
        center:center.clone(),
      });

      moveRadius = baseRadius - (baseRadius * kake);
      baseRadius *= kake;

    });

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}

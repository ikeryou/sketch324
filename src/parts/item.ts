import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { Vector3 } from 'three/src/math/Vector3';
import { CircleGeometry } from 'three/src/geometries/CircleGeometry';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { Conf } from "../core/conf";

export class Item extends MyObject3D {

  private _id:number;
  private _item:Array<{mesh:Mesh, noise:Vector3}> = [];
  private _speed:number = 2;

  constructor(opt:any) {
    super()

    this._id = opt.id;

    this._c = this._id * 10;

    const geo = new CircleGeometry(0.5, 64);

    const num = 1;
    for(let i = 0; i < num; i++) {
      const m = new Mesh(
        geo,
        new MeshBasicMaterial({
          color:Util.instance.randomArr(Conf.instance.COLOR),
          wireframe:Util.instance.hit(),
        }),
      );
      this.add(m);

      this._item.push({
        mesh:m,
        noise:new Vector3(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1))
      });
    }
  }


  public updateItem(opt:{radius:number, moveRadius:number, center:Vector3}):void {
    const baseRadius = opt.radius * 2;

    // スケールとか
    this._item.forEach((val,i) => {
      const m = val.mesh;

      let radius = Util.instance.map(i, baseRadius, baseRadius * 0.25, 0, this._item.length - 1);
      m.scale.set(radius, radius, 1);
    })

    // くるくる
    const r = Util.instance.radian(this._c)
    this.position.x = opt.center.x + Math.sin(r) * opt.moveRadius;
    this.position.y = opt.center.y + Math.cos(r) * opt.moveRadius;
  }


  protected _update():void {
    this._c += this._speed;
  }


  protected _resize(): void {
    super._resize();
  }
}
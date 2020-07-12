import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, PageHeader } from 'twomj-components-react';

import { getSilentAuthentication } from '../../Actions/AuthenticationAction';

import './canvas.css';
import { Circle, MousePos } from './CanvasHelper';
import { PurifyComponent } from '../../CoreFiles/AppClass';
import { IReduxStoreState } from '../../Reducers';

declare type IMyState = {
   canvas: React.RefObject<HTMLCanvasElement>;
   timer: NodeJS.Timeout;
   circle: Circle;
   mousePos: MousePos;
};
class PageNotFound extends PurifyComponent<Props> {
   myState: IMyState = {
      canvas: React.createRef(),
      timer: setInterval(() => {
         //this.onloadCanva();
      }, Math.RandomInteger(100, 100)) as unknown as NodeJS.Timeout,
      circle: new Circle(
         Math.RandomInteger(0, window.innerWidth),
         Math.RandomInteger(0, window.innerHeight),
         (Math.random() - 0.5) * 4,
         (Math.random() - 0.5) * 4,
         30),
      mousePos: new MousePos()
   };
   constructor(props: Props) {
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.resetCanvas = this.resetCanvas.bind(this);
   }
   componentWillUnmount() {
      this.myState.canvas.current?.removeEventListener("mousemove", this.onMouseMove);
      this.myState.canvas.current?.removeEventListener("resize", this.resetCanvas);
   }
   async componentDidMount() {
      this.myState.canvas.current?.addEventListener("mousemove", (event: globalThis.MouseEvent) => this.onMouseMove(event));
      this.myState.canvas.current?.addEventListener("resize", this.resetCanvas);
      this.onloadCanva();
   }
   onMouseMove(event: globalThis.MouseEvent) {
      this.myState.mousePos.x = event.offsetX;;
      this.myState.mousePos.y = event.offsetY;
   }
   resetCanvas() {
      clearInterval(this.myState.timer);
      this.onloadCanva();
   }
   onloadCanva() {
      const c = this.myState.canvas.current?.getContext("2d");
      c!.canvas.width = window.innerWidth / 1.3;
      //c!.canvas.width = stringToNumber((window.innerWidth / 1.3).toFixed(2));
      c!.canvas.height = window.innerHeight / 1.3;
      //c!.canvas.height = stringToNumber((window.innerHeight / 2).toFixed(2));
      var numOfCircles = 404;
      var circles: Circle[] = [];
      for (var i = 0; i < numOfCircles; i++) {
         const rd = Math.RandomInteger(7, 10);
         let cr = new Circle(
            Math.RandomInteger(0, (c!.canvas.width - rd * 2) + rd),
            Math.RandomInteger(0, c!.canvas.height - rd * 2) + rd,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            rd,
            `rgba(${Math.RandomInteger(0, 100)}, ${Math.RandomInteger(0, 100)}, ${Math.RandomInteger(0, 55)}, ${Math.RandomInteger(1, 1)})`
         );
         circles.push(cr);
      }
      this.myState.timer = setInterval(() => {
         if (window.innerWidth !== c?.canvas.width)
            c!.canvas.width = window.innerWidth / 1.3;
         if (window.innerHeight !== c?.canvas.height)
            c!.canvas.height = window.innerHeight / 1.3;
         c?.clearRect(0, 0, c!.canvas.width, c!.canvas.height);
         circles.map(cir => {
            let msRd = 80;
            if ((cir.x > (this.myState.mousePos.x! - msRd) && cir.x < (this.myState.mousePos.x! + msRd)) &&
               (cir.y > (this.myState.mousePos.y! - msRd) && cir.y < (this.myState.mousePos.y! + msRd))) {
               cir.radius = cir.radiusOrg * 3;
            }
            else {
               cir.radius = cir.radiusOrg;
            }
            if (cir.randomNum >= 0.9)
               cir.drawGravity(c);
            else
               cir.drawSpace(c);
         });
         this.forceUpdate();
      }, 30) as unknown as NodeJS.Timeout;
   }
   render() {
      return (
         <div className="container custom-container">
            <Row>
               <canvas ref={this.myState.canvas}
                  className="ml-auto mr-auto"
                  //onClick={() => clearInterval(this.myState.timer)}
                  onClick={() => { this.resetCanvas(); }}
               />
               <PageHeader children="(404) Page Not Found" className="col-md-6 col-12 ml-auto mr-auto text-center" />
            </Row>
         </div>
      );
   }
}

declare type Props = {
   getSilentAuthentication: any;
};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      getSilentAuthentication
   }, dispatch)
)(PageNotFound);

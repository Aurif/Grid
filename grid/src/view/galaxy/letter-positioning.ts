
import { v4 as uuidv4 } from 'uuid';

type keyframe = {t: number, x: number, y: number}
export default class LetterPositioning {
    readonly letterElement: HTMLSpanElement
    private positions: {x: keyframe[], y: keyframe[]} = {x: [], y: []}
    private marks: {x: {[key: number]: boolean}, y: {[key: number]: boolean}} = {x: {}, y: {}}
    constructor(letterElement: HTMLSpanElement) {
        this.letterElement = letterElement
    }

    private withRandomizedEdgePositions(positions: keyframe[]): keyframe[] {
        function randomMove(start: keyframe, t: number): keyframe {
            const dist = Math.abs(start.t-t)/100;
            if(start.x == undefined || start.y == undefined) throw Error("Cannot perform a random move with a start that doesn't have x, y values")
            const newX = start.x + dist*(Math.random()*window.innerWidth-window.innerWidth/2)*0.65
            const newY = start.y + dist*(Math.random()*window.innerHeight-window.innerHeight/2)*0.65

            return {t, x: newX, y: newY}
        }

        const newPositions = [...positions]
        let firstPosition
        if(newPositions.length > 0)
            firstPosition = newPositions.reduce((best, curr) => best.x==undefined ? curr : (curr.t < best.t && curr.x != undefined ? curr : best));
        if(firstPosition && firstPosition.x != undefined) newPositions.push(randomMove(firstPosition, 0))
        else {
            newPositions.push({
                t: 0,
                x: Math.round(Math.random()*window.innerWidth-window.innerWidth/2),
                y: Math.round(Math.random()*window.innerHeight-window.innerHeight/2)
            })
        }

        const lastPosition = newPositions.reduce((best, curr) => best.x==undefined ? curr : (curr.t > best.t && curr.x != undefined ? curr : best));
        newPositions.push(randomMove(lastPosition, 100))

        return newPositions
    }

    public canUseTriggerAt(x: number, y: number): boolean {
        const trigX = Math.round(x/window.innerWidth*100), trigY = Math.round(y/window.innerHeight*100)
        return !(this.marks.x[trigX] || this.marks.y[trigY])
    }

    public addPosition(triggerPos: {x: number, y: number}, targetPos: {x: number, y: number}) {
        if(!this.canUseTriggerAt(triggerPos.x, triggerPos.y)) throw Error('Forbidden trigger coordinates - those values are already reserved')
        const xSplit = Math.random()*2-0.5, ySplit = Math.random()*2-0.5;
        const targetX = targetPos.x, targetY = targetPos.y;
        const xC1 = Math.round(targetX*xSplit), yC1 = Math.round(targetY*ySplit);
        const xC2 = targetX-xC1, yC2 = targetY-yC1;

        function pushWithMargins(target: keyframe[], {x, y, t}: {x: number, y: number, t: number}) {
            target.push({x: x, y: y, t: t+1.5})
            target.push({x: x, y: y, t: t-1.5})
        }
        const trigX = triggerPos.x/window.innerWidth*100, trigY = triggerPos.y/window.innerHeight*100
        pushWithMargins(this.positions.x, {x: xC1, y: yC1, t: Math.round(trigX*10)/10})
        pushWithMargins(this.positions.y, {x: xC2, y: yC2, t: Math.round(trigY*10)/10})
        for(let i=Math.round(trigX)-9; i<=Math.round(trigX)+9; i++) this.marks.x[i] = true
        for(let i=Math.round(trigY)-9; i<=Math.round(trigY)+9; i++) this.marks.y[i] = true
    }

    public applyPositions() {
        function generateAnimation(name: string, positions: keyframe[], mappingFunc: (x: number, y: number)=>string): HTMLStyleElement {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `@keyframes ${name} { ${positions.map(({t, x, y}) => `${t}% {${mappingFunc(x, y)}}`).join('\n')} }`
            return style
        }

        const animationName = 'a-'+uuidv4()
        this.letterElement.appendChild(generateAnimation(animationName+'-x', this.withRandomizedEdgePositions(this.positions.x), (x, y) => `transform: translate(${x}px, ${y}px);`))
        this.letterElement.appendChild(generateAnimation(animationName+'-y', this.withRandomizedEdgePositions(this.positions.y), (x, y) => `left: ${x}px; top: ${y}px;`))
        this.letterElement.style.setProperty('animation-name', `${animationName}-x, ${animationName}-y`)
    }


}
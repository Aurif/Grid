<script setup lang="ts">
  import { onMounted, ref, watch, type Ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid';

  const span = ref<HTMLSpanElement[] | null>(null)
  class LetterManager {
    private letterPositionings: {[key: string]: LetterPositioning[]} = {}
    constructor(elementReference: Ref<HTMLSpanElement[] | null>) {
        watch(elementReference, () => {
            if(!elementReference.value) return
            for(const span of elementReference.value) {
                let char = span.innerText
                if(!this.letterPositionings[char]) this.letterPositionings[char] = []
                this.letterPositionings[char].push(new LetterPositioning(span))
            }
        })
    }

    public placeEntry(x: number, y: number, entry: string) {
        let LETTER_WIDTH = 16
        let startX = x-(entry.length-1)*LETTER_WIDTH/2
        for(let i = 0; i<entry.length; i++) {
            let char = entry[i]
            let positioning = this.letterPositionings[char][0] // TODO: proper char selection
            // TODO: deal with not enough chars
            positioning.addPosition({x, y}, {x: startX+i*LETTER_WIDTH, y})
        }
    }

    public applyPositions() {
        for(let char in this.letterPositionings) {
            for(let positioning of this.letterPositionings[char]) {
                positioning.applyPositions()
            }
        }
    }
  }
  const letterManager = new LetterManager(span)

  type keyframe = {t: number, a: number, x?: number, y?: number}
  class LetterPositioning {
    private letterElement: HTMLSpanElement
    private positions: {x: keyframe[], y: keyframe[]} = {x: [], y: []}
    constructor(letterElement: HTMLSpanElement) {
        this.letterElement = letterElement
    }

    private withRandomizedEdgePositions(positions: keyframe[]): keyframe[] {
        function randomMove(start: keyframe, t: number): keyframe {
            const dist = Math.abs(start.t-t)/100;
            if(start.x == undefined || start.y == undefined) throw Error("Cannot perform a random move with a start that doesn't have x, y values")
            const newX = start.x + dist*(Math.random()*window.innerWidth-window.innerWidth/2)*0.35
            const newY = start.y + dist*(Math.random()*window.innerHeight-window.innerHeight/2)*0.35

            return {t, x: newX, y: newY, a: 0}
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
                y: Math.round(Math.random()*window.innerHeight-window.innerHeight/2),
                a: 0
            })
        }

        const lastPosition = newPositions.reduce((best, curr) => best.x==undefined ? curr : (curr.t > best.t && curr.x != undefined ? curr : best));
        newPositions.push(randomMove(lastPosition, 100))

        return newPositions
    }

    public addPosition(triggerPos: {x: number, y: number}, targetPos: {x: number, y: number}) {
        let xSplit = Math.random()*2-0.5, ySplit = Math.random()*2-0.5;
        let targetX = targetPos.x-window.innerWidth/2, targetY = targetPos.y-window.innerHeight/2;
        let xC1 = Math.round(targetX*xSplit), yC1 = Math.round(targetY*ySplit);
        let xC2 = targetX-xC1, yC2 = targetY-yC1;

        function pushWithMargins(target: keyframe[], {x, y, t}: {x: number, y: number, t: number}) {
            target.push({t: t+2.5, a: 0})
            target.push({x: x, y: y, t: t+1.5, a: 1})
            target.push({x: x, y: y, t: t-1.5, a: 1})
            target.push({t: t-2.5, a: 0})
        }
        pushWithMargins(this.positions.x, {x: xC1, y: yC1, t: Math.round(triggerPos.x/window.innerWidth*1000)/10})
        pushWithMargins(this.positions.y, {x: xC2, y: yC2, t: Math.round(triggerPos.y/window.innerHeight*1000)/10})
    }

    public applyPositions() {
        function generateAnimation(name: string, positions: keyframe[], mappingFunc: (x: number, y: number)=>string, opacityKeyword: string): HTMLStyleElement {
            function keyframeMapping(keyframe: keyframe) {
                return `${keyframe.t}% {
                    ${keyframe.x!=undefined && keyframe.y!=undefined ? mappingFunc(keyframe.x, keyframe.y) : ''}
                    ${opacityKeyword}: ${keyframe.a};
                }`
            }
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `@keyframes ${name} { ${positions.map(keyframeMapping).join('\n')} }`
            return style
        }

        var animationName = 'a-'+uuidv4()
        this.letterElement.appendChild(generateAnimation(animationName+'-x', this.withRandomizedEdgePositions(this.positions.x), (x, y) => `transform: translate(${x}px, ${y}px);`, '--opacity-x'))
        this.letterElement.appendChild(generateAnimation(animationName+'-y', this.withRandomizedEdgePositions(this.positions.y), (x, y) => `left: ${x}px; top: ${y}px;`, '--opacity-y'))
        this.letterElement.style.setProperty('animation-name', `${animationName}-x, ${animationName}-y`)
    }


  }

  const parentElement = ref<HTMLDivElement | null>(null)
  onMounted(()=>{
    window.addEventListener("mousemove", (e) => {
        if(!parentElement.value) return
        parentElement.value.style.setProperty('--animation-state-x', Math.round((-e.clientX/window.innerWidth*1000))/10+'s')
        parentElement.value.style.setProperty('--animation-state-y', Math.round((-e.clientY/window.innerHeight*1000))/10+'s')
    })
    setTimeout(() => {
        letterManager.placeEntry(window.innerWidth/2, window.innerHeight/2, 'AWO')
        letterManager.placeEntry(200, 200, 'BRAVE')
        letterManager.applyPositions()
    }, 100)
  })

  const charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ'
</script>

<template>
    <div ref="parentElement">
        <span v-for="i in charset.length*6" :key="i" ref="span">{{ charset[i%charset.length] }}</span>
    </div>
</template>

<style scoped>
    div {
        position: absolute;
        left: 50%;
        top: calc(50% - 15px);
    }

    span {
        --color-active: #eee683;
        color: #ffffff;
        font-size: 30px;
        font-family: 'Roboto Mono', monospace;
        opacity: max(0.1, min(var(--opacity-x), var(--opacity-y)));
        user-select: none;
        width: 16px;
        flex-grow: 1;
        text-align: center;
        position: absolute;
        animation-duration: 100s;
        animation-play-state: paused;
        animation-timing-function: linear;
        animation-delay: var(--animation-state-x), var(--animation-state-y);
    }

    span.active {
        opacity: 1;
        color: var(--color-active);
        text-shadow: 0 0 4px var(--color-active);
    }
</style>
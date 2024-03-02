import { mapObject, shuffle } from 'underscore';
import { watch, type Ref } from 'vue';
import LetterPositioning from './letter-positioning'

const LETTER_WIDTH = 16, LETTER_HEIGHT = 30
export default class LetterManager {
    private letterPositionings: {[key: string]: LetterPositioning[]} = {}
    constructor(elementReference: Ref<HTMLSpanElement[] | null>) {
        watch(elementReference, () => {
            if(!elementReference.value) return
            for(const span of elementReference.value) {
                const char = span.innerText
                if(!this.letterPositionings[char]) this.letterPositionings[char] = []
                this.letterPositionings[char].push(new LetterPositioning(span))
            }
        })
    }

    public placeEntryRandomly(entry: string) {
        const maxY = window.innerHeight/2-LETTER_HEIGHT
        const maxX = window.innerWidth/2-entry.length/2*LETTER_WIDTH
        this.placeEntry(
            window.innerWidth/2+(Math.random()*2-1)*maxX,
            window.innerHeight/2+(Math.random()*2-1)*maxY,
            entry
        )
    }

    public placeEntry(x: number, y: number, entry: string) {
        const charOccurences = entry.split('').reduce((chars, ch) => {chars[ch] = (chars[ch] || 0)+1; return chars}, {} as {[key: string]: number})
        const lettersToUse = mapObject(charOccurences, (count: number, char: string) => {
            return shuffle(this.letterPositionings[char].filter(l => l.canUseTriggerAt(x, y))).slice(0,count);
        })
        // TODO: deal with not enough chars

        const startX = x-(entry.length-1)*LETTER_WIDTH/2
        for(let i = 0; i<entry.length; i++) {
            const char = entry[i]
            const positioning = lettersToUse[char][0]
            lettersToUse[char].shift()
            positioning.addPosition({x, y}, {x: startX+i*LETTER_WIDTH, y})
        }
    }

    public applyPositions() {
        for(const char in this.letterPositionings) {
            for(const positioning of this.letterPositionings[char]) {
                positioning.applyPositions()
            }
        }
    }
}
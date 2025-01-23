import { reactive } from "vue";

const initialState = {
  canvas: undefined,
  img: new Image(),
  width: 720,
  height: 720,
  currentScale: 1,
  currentOffsetX: 0,
  currentOffsetY: 0,
  isPanning: false,
  currentMouseX: 0,
  currentMouseY: 0,
  minScale: 1,
  maxScale: 10,
  initTouchDist: null,
  isSketching: false,
  annotations: [],
  currentStroke: [],
  isPanToolSelected: true,
  isSketchToolSelected: false,
  isSelectToolSelected: false,
  isCommentToolSelected: false,
  selectedAnnotations: [],
  comments: [],
  isRectangleToolSelected: false,
  isCircleToolSelected: false,
  isArrowToolSelected: false,
  isDrawingShape: false,
  currentShapeStart: null,
  currentShapeEnd: null,
};

var as = reactive({ ...initialState });

function resetState() {
  Object.assign(as, { ...initialState });
}

export { as, resetState };

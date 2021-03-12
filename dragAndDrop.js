let dragAndDrop = (function(){

  let dragNode = null;
  let dragstart = function(evt) {
    // 드래그한 요소에 대한 참조 변수
    if (!evt.target.classList.contains('dnd-draggable')) {return;}
    dragNode = evt.target;
    dragNode.classList.add('dnd-draggable-dragging')
    _doc.body.classList.add('dnd-body-dragging')
    evt.dataTransfer.effectAllowed = dragAndDrop.effectAllowed;

  };
  let dragend = function(evt) {
    // 드래그한 요소에 대한 참조 변수
    if(!dragNode){return;}
    dragNode.classList.remove('dnd-draggable-dragging')
    _doc.body.classList.remove('dnd-body-dragging')
    dragNode = null;
  };
  let dragover = function(evt) {
    // 드롭을 허용하도록 prevetDefault() 호출
    if (evt.target.classList.contains('dnd-dropzone')) {
      evt.dataTransfer.dropEffect  = dragAndDrop.dropEffect;
    }else{
      evt.dataTransfer.dropEffect  = "none";
    }
    if(dragNode)  evt.preventDefault();
  };

  let dragenter = function(evt) {
    // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
    if(!dragNode){return;}
    if (!evt.target.classList.contains('dnd-dropzone')) {return;}
    evt.target.classList.add('dnd-dropzone-dragenter')
  };
  let dragleave = function(evt) {
    // 요소를 드래그하여 드롭하려던 대상으로부터 벗어났을 때 배경색 리셋
    if(!dragNode){return;}
    if (!evt.target.classList.contains('dnd-dropzone')) {return;}
    evt.target.classList.remove('dnd-dropzone-dragenter');
  };

  let drop = function(evt) {
    // 기본 액션을 막음 (링크 열기같은 것들)
    if(!dragNode){return;}
    if(!evt.target.classList.contains('dnd-dropzone')) {return ;}
    evt.preventDefault();
    let r = dragAndDrop.ondrop(evt,dragNode,evt.target);
    dragNode.classList.remove('dnd-draggable-dragging')
    dragNode.classList.add('dnd-draggable-droped')
    setTimeout(
      function(dragNode){
        return function(){ dragNode.classList.remove('dnd-draggable-droped') }
      }(dragNode)
      ,100);
    evt.target.classList.remove('dnd-dropzone-dragenter')
    _doc.body.classList.remove('dnd-body-dragging')
    dragNode = null;
    return r;
  };
  let _running = false;
  let _doc = null;
  let dragAndDrop = {
    "running":() => _running ,
    "debug":false ,
    "effectAllowed":null, // copy,move,link,none
    "dropEffect":"move", // copy,move,link,none
    "ondrop":function(evt,dragNode,dropNode){
      console.log(evt,dragNode,dropNode);
    },
    "enable":function(doc){
      if(this.running()){ if(this.debug){ console.log("dragAndDrop already running."); } return false;}
      _doc = doc || window.document;
      _doc.addEventListener("dragstart", dragstart,false);
      _doc.addEventListener("dragend", dragend,false);
      _doc.addEventListener("dragover", dragover,false);
      _doc.addEventListener("dragenter", dragenter,false);
      _doc.addEventListener("dragleave", dragleave,false);
      _doc.addEventListener("drop", drop,false);
      _running = true;
      return true;
    },
    "disable":function(){
      if(!this.running()){ if(this.debug){ console.log("dragAndDrop is not running."); } return false;}
      _doc.removeEventListener("dragstart", dragstart.false);
      _doc.removeEventListener("dragend", dragend.false);
      _doc.removeEventListener("dragover", dragover.false);
      _doc.removeEventListener("dragenter", dragenter.false);
      _doc.removeEventListener("dragleave", dragleave.false);
      _doc.removeEventListener("drop", drop.false);
      _doc = null;
      _running = false;
      return true;
    },
  }
  return dragAndDrop;
})()

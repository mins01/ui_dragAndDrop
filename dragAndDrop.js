let dragAndDrop = (function(){

  let dragNode = null;
  let dragstart = function(evt) {
    // 드래그한 요소에 대한 참조 변수
    if (!evt.target.classList.contains('dnd-draggable')) {return;}
    dragNode = evt.target;
    dragNode.classList.add('dnd-draggable-dragging')
    _doc.body.classList.add('dnd-body-dragging')
    evt.dataTransfer.effectAllowed = dragAndDrop.effectAllowed;
    evt.dataTransfer.setData("text/plain",  "dragAndDrop");

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
    if(dragNode)  evt.preventDefault();
    if (evt.target.classList.contains('dnd-dropzone')) {
      let dropEffect = evt.target.dataset.dropeffect || dragAndDrop.dropEffect || null
      if(dropEffect) evt.dataTransfer.dropEffect = dropEffect;
    }else{
      evt.dataTransfer.dropEffect  = "none";
    }
    // if(dragAndDrop.debug){ console.log(evt.target.dataset.dropeffect,evt.dataTransfer.effectAllowed , evt.dataTransfer.dropEffect,dropEffect); }
  };

  let dragenter = function(evt) {
    // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
    if(!dragNode){return;}
    if (!evt.target.classList.contains('dnd-dropzone')) {return;}

    let dropEffect = evt.target.dataset.dropeffect || dragAndDrop.dropEffect || null
    if(dropEffect) evt.dataTransfer.dropEffect = dropEffect;
    if(
      dropEffect==="none"
      || evt.dataTransfer.effectAllowed=="none"
      || (evt.dataTransfer.effectAllowed!=="all" && dropEffect != null && evt.dataTransfer.effectAllowed.toLowerCase().indexOf(evt.dataTransfer.dropEffect)==-1)
    )
    {
      return
    }
    if(dragAndDrop.debug){ console.log(evt.target.dataset.dropeffect,evt.dataTransfer.effectAllowed , evt.dataTransfer.dropEffect,dropEffect); }
    evt.target.classList.add('dnd-dropzone-dragenter')
    console.log();
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
    evt.target.classList.remove('dnd-dropzone-dragenter')
    _doc.body.classList.remove('dnd-body-dragging')

    dragNode.classList.add('dnd-draggable-droped')
    evt.target.classList.add('dnd-draggable-droped')
    setTimeout(
      function(dragNode,dropNode){
        return function(){
          dragNode.classList.remove('dnd-draggable-droped')
          dropNode.classList.remove('dnd-draggable-droped')
        }
      }(dragNode,evt.target)
      ,100);
    dragNode = null;
    evt.preventDefault();
    return r;
  };
  let _running = false;
  let _doc = null;
  let dragAndDrop = {
    "running":() => _running ,
    "debug":false ,
    "effectAllowed":null, // 허용 dropEffect : copy,move,link,none,all,copyMove,copyLink,linkMove,uninitialized
    "dropEffect":null, // 기본 dropEffect : copy,move,link,none
    "ondrop":function(evt,dragNode,dropNode){
      console.log(evt,dragNode,dropNode);
    },
    "enable":function(doc){
      if(this.running){ if(this.debug){ console.log("dragAndDrop already running."); } return false;}
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
      if(!this.running){ if(this.debug){ console.log("dragAndDrop is not running."); } return false;}
      _doc.removeEventListener("dragstart", dragstart);
      _doc.removeEventListener("dragend", dragend);
      _doc.removeEventListener("dragover", dragover);
      _doc.removeEventListener("dragenter", dragenter);
      _doc.removeEventListener("dragleave", dragleave);
      _doc.removeEventListener("drop", drop);
      _doc = null;
      _running = false;
      return true;
    },
  }
  Object.defineProperty(dragAndDrop, 'running', {
		get:function(){ return _running; },
		set:function(v){  return _running; },
		//value:"init", //기본값 (get,set 과 같이 사용불가)
		//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
		enumerable: true, //목록 열거시 표시여부
		configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
	});
  return dragAndDrop;
})()

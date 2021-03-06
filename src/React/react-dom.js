function render(vnode, container) {
    const node = createNode(vnode)
    container.appendChild(node)
}


function createNode(vnode) {

    const {type, props, nodeValue} = vnode
    let node
    if (type === 'TEXT') {
        node = document.createTextNode(nodeValue)
    } else if (typeof type === 'string') {
        node = document.createElement(type, props)
    } else if (typeof type === 'function') {
        node = type.isReactComponent
            ? updateFunctionComponent(type, props)
            : updateClassComponents(type, props)
    }

    const childrens = props.children
    if (childrens.length > 0) {
        childrens.forEach(child => {
            render(child, node)
        })
    }
    updateNode(node, props)
    return node;
}

function updateFunctionComponent(type, props) {
    return createNode(type(props))
}

function updateClassComponents(type, props) {
    return createNode(new type(props).render())
}

function updateNode(node, nextVal) {
    let eventName
    Object.keys(nextVal).forEach(key => {
        if (key === 'children') return
        if ((eventName = key.slice(0, 2)) === "on") {
            node.addEventListener(eventName, nextVal[key]);
        } else  {
            node[key] = nextVal[key];
        }
    })
}

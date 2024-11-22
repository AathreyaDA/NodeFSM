import { createSignal } from "solid-js";
import VariableStructure from "../../Interfaces/VariableStructure";


// const dropDownElement = (items : string[] | variableStructure[], defaultValue : string) => {
//     const getItemName = (item : string | variableStructure) => {
//         return typeof(item) === 'string' ? item : item.name;
//     }

//     // if(typeof(items ) === 'string[]'){
//     console.log(typeof(items))
//     const dropdown = document.createElement('span');
//     dropdown.classList.add('dropdown');

//     const toggle = document.createElement('button');
//     toggle.classList.add('dropdown-toggle');
//     toggle.textContent = defaultValue;

//     const menu = document.createElement('ul');
//     menu.classList.add('dropdown-menu');
//     menu.style.display = 'none';

//     items.forEach(item => {
//     const itemEl = document.createElement('li');
//     itemEl.classList.add('dropdown-item');
//     itemEl.textContent = item;

//     itemEl.addEventListener('click', () => {
//         toggle.textContent = item;
//         menu.style.display = 'none';
//     });

//     menu.appendChild(itemEl);
//     });

//     toggle.addEventListener('click', () => {
//     menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
//     });

//     dropdown.appendChild(toggle);
//     dropdown.appendChild(menu);
    
//     }
    
//     // dropdown.textContent = "Dropdown";
    


const dropDownElement = (items : string[] | VariableStructure[], defaultValue : string | VariableStructure, selectedVariableIndex? : number) => {
    if( typeof(items[0]) == 'string'){
        const dropdown = document.createElement('span');
    dropdown.classList.add('dropdown');

    const toggle = document.createElement('button');
    toggle.classList.add('dropdown-toggle');
    toggle.textContent = typeof(defaultValue) =="string" ? defaultValue : defaultValue.name;

    const menu = document.createElement('ul');
    menu.classList.add('dropdown-menu');
    menu.style.display = 'none';

    items.forEach(item => {
    const itemEl = document.createElement('li');
    itemEl.classList.add('dropdown-item');
    itemEl.textContent = item;

    itemEl.addEventListener('click', () => {
        toggle.textContent = item;
        menu.style.display = 'none';
    });

    menu.appendChild(itemEl);
    } );

    toggle.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    dropdown.appendChild(toggle);
    dropdown.appendChild(menu);

    // dropdown.textContent = "Dropdown";
    return dropdown;
    }

    if(selectedVariableIndex || selectedVariableIndex === 0){
        defaultValue = items[selectedVariableIndex];
    }
    const [previousVariable, setPreviousVariable] = createSignal<string>(null);
    //If variable type
    const dropdown = document.createElement('span');
    dropdown.classList.add('dropdown');

    const toggle = document.createElement('button');
    toggle.classList.add('dropdown-toggle');
    if(typeof(defaultValue)=="string"){
        toggle.textContent = defaultValue;
        toggle.value = defaultValue;
    }
    else{
        toggle.textContent = defaultValue.name;
        // toggle.value = JSON.stringify(defaultValue);/
        toggle.classList.add(JSON.stringify(defaultValue));
        setPreviousVariable(JSON.stringify(defaultValue));
    }
    

    const menu = document.createElement('ul');
    menu.classList.add('dropdown-menu');
    menu.style.display = 'none';

    items.forEach(item  => {
    const itemEl = document.createElement('li');
    itemEl.classList.add('dropdown-item');
    const variableObject = {
        name: item.name,
        value: item.value
    }
    itemEl.appendChild(<div class= {JSON.stringify(variableObject)} > {item.name} </div> as HTMLElement) ;

    itemEl.addEventListener('click', () => {
        toggle.textContent = item.name;
        if(previousVariable())
            toggle.classList.replace(previousVariable(), JSON.stringify(variableObject));
        else
            toggle.classList.add(JSON.stringify(variableObject));

            setPreviousVariable(JSON.stringify(variableObject));
        // console.log('Toggle List classList: ', toggle.classList);
        // console.log(dropdown.children[0].classList[1]);
        menu.style.display = 'none';
    });

    menu.appendChild(itemEl);
    });

    toggle.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    dropdown.appendChild(toggle);
    dropdown.appendChild(menu);

    // dropdown.textContent = "Dropdown";
    return dropdown;
    
}

export default dropDownElement;
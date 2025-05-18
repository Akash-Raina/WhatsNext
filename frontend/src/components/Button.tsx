export const Button = ({value, onclick, classname}: {value: string, onclick: ()=>void, classname?: string})=>{

    return <button onClick={onclick} className = {classname ? classname : "bg-red-600 hover:bg-red-900 cursor-pointer text-white font-bold py-2 px-4 rounded mt-2"}>
        {value}
    </button>
}
export const Button = ({value, onclick}: {value: string, onclick: ()=>void})=>{

    return <button onClick={onclick} className="border rounded-xl font-semibold h-14 w-28 cursor-pointer">
        {value}
    </button>
}
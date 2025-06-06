import * as React from "react";
import { FC, useEffect, useState } from "react"
import { useLoaderData, Link, Location,ScrollRestoration, useMatches } from "react-router-dom";

interface ArrayLoaderData {
  arr: Array<number>;
}

export async function getArrayLoader(): Promise<ArrayLoaderData> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    arr: new Array(100).fill(null).map((_, i) => i),
  };
}

export const TestPage: FC = () => {
    let data = useLoaderData() as ArrayLoaderData;
    //const [isLoaded, setIsLoaded] = useState(false);

 
    /*useEffect(()=>{
        //setIsLoaded(false);
        const array = Array.from({length: 101}, (_, i) => i);
        setArr(array);
        console.log('грузим массив')
        
    },[])

    useEffect(()=>{
        console.log('сменился массив',arr)
        if (arr.length>0) {
            console.log('arr.length>0')
            setIsLoaded(true);
        }
    },[arr])*/
    
    return <>
    <ul>
        {data.arr.map((el=><li key={el}><Link  to="/keyword/2197">{el}</Link></li>))}
    </ul>
    </>
}
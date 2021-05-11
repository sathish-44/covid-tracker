import { createGlobalStyle } from "styled-components";


export const lightTheme = {
    body: '#E8EAF6',
    fontColor : '#000'
}

export const darkTheme = {
    body : '#212121',
    fontColor : '#fff'
}


export const GlobalStyles = createGlobalStyle`
	body {
		background-color: ${(props) => props.theme.body};
	}
`;
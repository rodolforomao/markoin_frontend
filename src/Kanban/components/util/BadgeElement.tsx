import { Badge } from 'react-bootstrap';

interface Props {
    index?: string;
    listBadge?: string | null;
    // Criar no futuro para receber as cores do backend
    listColors?: string | null;
  }
  
  function BadgeElement(props: Props) {
    const { index, listBadge, listColors} = props;
    
    // Usar o listColors aqui, recebendo do backend as classes das cores
    let arrayClassColorBadge = selectBadgeColor(listBadge ?? null);
    
    let widthBadge = selectBadgeWidth(arrayClassColorBadge ?? 'auto');

    return (
        <>
          { arrayClassColorBadge && (
            arrayClassColorBadge.map((color, index) => (
            <Badge key={index} bg={color} style={{ width: widthBadge }}>
              <div></div>
            </Badge>
            )))
          }
        </>
      );
  }
  
  
  function selectBadgeColor(color: string | null){
    let arrayColorBadge: string[] = [];
    if(color)
    {
      let mapColors = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark'
      ];
  
      let colorsArray: string[] = color.split(',');
      // Mapeia os números contidos na string para os nomes das cores
        arrayColorBadge = colorsArray.map((indexString: string) => {
        // Converte a string do índice em um número
        let index: number = parseInt(indexString, 10);
        // Verifica se o índice está dentro do intervalo permitido
        if (index >= 0 && index < mapColors.length) {
          // Retorna a cor correspondente ao índice
          return mapColors[index];
        } else {
          // Se o índice estiver fora do intervalo, retorna uma cor padrão ou trata de outra forma
          return 'defaultColor'; // Por exemplo, você pode retornar uma cor padrão ou lidar com isso de outra forma
        }
      });
    }
    
    return arrayColorBadge;
  }
  
  function selectBadgeWidth(arrayClassColorBadge: string[] ) { 
    let calculatedWidth = 'auto';
    if(arrayClassColorBadge && arrayClassColorBadge.length > 0)
    {
      let defaultNumberWidth = 60;
      let count = arrayClassColorBadge.length;
      if(count <= 3)
      {
        let defaultWidth = defaultNumberWidth.toString() + '%';
        calculatedWidth = defaultWidth;
        calculatedWidth = (((defaultNumberWidth) / count)).toString() + '%';
      }
      else if(count <= 6)
      {
        defaultNumberWidth = 80;
        let defaultWidth = defaultNumberWidth.toString() + '%';
        calculatedWidth = defaultWidth;
        calculatedWidth = (((defaultNumberWidth) / count)).toString() + '%';
      }
      else
      {
        defaultNumberWidth = 100;
        let defaultWidth = defaultNumberWidth.toString() + '%';
        calculatedWidth = defaultWidth;
        calculatedWidth = (((defaultNumberWidth) / count)).toString() + '%';
      }
    
    }
    return calculatedWidth;
  }

  export default BadgeElement;
  
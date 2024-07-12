import { useState } from 'react';

const CreateAction = (props: Props) => {
    const { isAdmin } = props;

    const [isOpen, setIsOpen] = useState(false);

    if (isAdmin) {
        return (
            <button onClick={() => setIsOpen(true)} className='btn'>
                Criar Quadro
            </button>
        );
    }
    else {
        return null;
    }
};

interface Props {
    isAdmin: number;
}

export default CreateAction;

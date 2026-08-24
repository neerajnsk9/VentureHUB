import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
    const { nextUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate('/' + nextUrl);
            }, 6000);
        }
    }, []);

    return (
        <div className='flex justify-center items-center h-[80vh]'>
            <Loader2Icon className='animate-spin text-[#a11c5e] size-8' />
        </div>
    );
};

export default Loading;

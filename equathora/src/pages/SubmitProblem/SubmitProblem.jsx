import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SubmitProblem = () => {
    return (
        <div>
            <Navbar />
            <main className='bg-[var(--main-color)] font-[Sansation] flex w-full justify-center items-center'>
                <section className='flex flex-col lg:flex-row justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'>
                    <article>
                        <h1 className="text-4xl md:text-left pb-2 cursor-default font-[Sansation] font-extrabold">Submit a problem</h1>
                    </article>
                </section>

            </main>
            <Footer />
        </div>
    )
}

export default SubmitProblem

"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../../@/components/ui/dialog"
import { Input } from "../../../../../@/components/ui/input"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '../../../../../components/ui/button'
import { Budgets } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { db } from '../../../../../utils/dbConfig'


function CreateBudget({ refreshData }) {

    const [emojiIcon, setEmojiIcon] = useState('😊')
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const { user } = useUser();


    const onCreateBudget = async () => {
        const result = await db.insert(Budgets)
            .values({
                name: name,
                amount: amount,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                icon: emojiIcon
            }).returning({ insertedId: Budgets.id })

        if (result) {
            refreshData()
            toast("New Budget Created")
        }
    }

    return (

        <Dialog className='fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'>
            <DialogTrigger asChild>
                <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md transition-all h-full justify-center'>
                    <h2 className='text-3xl'>+</h2>
                    <h2>Create New Budget</h2>
                </div>
            </DialogTrigger>
            <DialogContent className="w-96 rounded-sm border p-5">
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        <div className='mt-5'>
                            <Button variant="outline" text="large" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                            <div className='absolute top-50 z-50'>
                                <EmojiPicker
                                    open={openEmojiPicker}
                                    onEmojiClick={(e) => {
                                        setEmojiIcon(e.emoji)
                                        setOpenEmojiPicker(false)
                                    }} />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                <Input placeholder="eg. Home Decor"
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <Input placeholder="eg. 5000Rs"
                                    type='number'
                                    onChange={(e) => setAmount(e.target.value)} />
                            </div>

                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            onClick={() => onCreateBudget()}
                            disabled={!(name && amount)}
                            className="mt-5 w-full">Create Budget</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBudget
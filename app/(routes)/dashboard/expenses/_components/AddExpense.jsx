import React, { useState } from 'react'
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, user, refreshData }) {
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [loading, setLoading] = useState(false)

    const addNewExpense = async () => {
        setLoading(true)
        const result = await db.insert(Expenses).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdAt: new Date().toLocaleDateString('en-GB')
        }).returning({ insertedId: Budgets.id });
        setAmount('')
        setName('')
        if (result) {
            setLoading(false)
            refreshData()
            toast('New Expense Added')
        }
        setLoading(false)
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder="e.g. Study room Decor" value={name}
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input placeholder="e.g. 1000Rs" type='number' value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button
                onClick={() => addNewExpense()}
                disabled={!(name && amount) || loading} className='w-full mt-3'>{loading ? <Loader className='animate-spin' /> : "Add New Expense"}</Button>
        </div>
    )
}

export default AddExpense
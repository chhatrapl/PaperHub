import 'dotenv/config'
import {createClient} from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey =  process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket = process.env.SUPABASE_STORAGE_BUCKET

if (!url || !serviceRoleKey || !bucket) {
    throw new Error('Supabase URL, service role key, and storage bucket must be provided in the env file')
}

export const supabase = createClient(url, serviceRoleKey,{
    auth:{
        autoRefreshToken:false,
        persistSession:false,
    },
})

export const questionPapersBucket = bucket

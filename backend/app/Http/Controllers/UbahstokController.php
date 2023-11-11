<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ubahstok;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UbahstokController extends Controller
{

    public function Add(Request $request){
        $request->validate([
            'id' => 'required',
            'qty' => 'required'
        ]);
        
        try{
        DB::beginTransaction();

        $result = ubahstok::create([
            'idmenu' => $request->id,
            'qty' => $request->qty
        ]);

        if($result){
        DB::commit();
            return response()->json([
                'message' => 'Stok berhasil ditambahkan.'
            ], 200);
        }else{
        DB::rollBack();
            return response()->json([
                'message' => 'Stok gagal ditambahkan.'
            ], 500);
        }
    }catch(\Exception $e){
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
        
    }
}

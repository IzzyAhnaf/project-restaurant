<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\menu;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;


class MenuController extends Controller
{
    public function index(){
        return response()->json(
            menu::latest()->get()
        );
    }

    public function Add(Request $request){
        $request->validate([
            'menu' => 'required',
            'harga' => 'required|numeric|min:0',
            'qty' => 'required|numeric|min:0',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);
    
        try {
            DB::beginTransaction();
    
            if($request->hasFile('gambar')){
                $gambar = $request->file('gambar');
                $namagambar = time() . '.' . $gambar->getClientOriginalExtension();
                $gambar->move(public_path('images'), $namagambar);
    
                $idmenu = 'B' . Str::random(8);

                menu::create([
                    'id' => $idmenu,
                    'namamenu' => $request->input('menu'),
                    'harga' => $request->input('harga'),
                    'jumlah' => $request->input('qty'),
                    'gambar' => $namagambar
                ]);
    
                DB::commit();
    
                return response()->json([
                    'message' => 'Barang berhasil ditambahkan.'
                ]);
            } else {
                throw new \Exception('Gambar tidak ditemukan dalam permintaan.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
    
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function edit(string $id){
        $find = menu::find($id);
        if($find){
            return response()->json($find);
        }else{
            return response()->json([
                'message' => 'Barang tidak ditemukan.'
            ], 404);
        }
    }

    public function Update(Request $request, string $id){
        try {
            $find = menu::where('id', $id)->first();
    
            if ($request->hasFile('gambar')) {
                $gambar = $request->file('gambar');
                $namagambar = time() . '.' . $gambar->getClientOriginalExtension();
                $gambar->move(public_path('images'), $namagambar);

                $find->update([
                    'namamenu' => $request->namamenu,
                    'harga' => $request->harga,
                    'jumlah' => $request->jumlah,
                    'gambar' => $namagambar 
                ]);


            } else {
                $find->update([
                    'namamenu' => $request->namamenu,
                    'harga' => $request->harga,
                    'jumlah' => $request->jumlah
                ]);
            }
    
            return response()->json([
                'message' => $request->namamenu 
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function Delete(string $id){
        $find = menu::find($id);
        if($find){
            $find->delete();
            return response()->json([
                'message' => 'Barang berhasil dihapus.'
            ]);
        }else{
            return response()->json([
                'message' => 'Barang tidak ditemukan.'
            ], 404);
        }
    }

}
